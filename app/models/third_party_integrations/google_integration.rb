require 'googleauth'
require 'google/apis/proximitybeacon_v1beta1'
class GoogleIntegration < ThirdPartyIntegration

    after_save :create_sync_job!, if: -> { google_project_id_changed? && access_token }
    after_destroy :revoke_access_token

    validate :did_not_switch_projects

    has_many :sync_jobs, class_name: "GoogleSyncJob", foreign_key:  "third_party_integration_id" do

        def latest
            last
        end

        def previous
            last(2).last
        end
    end

    def self.model_type
        @@model_type ||= "google-integration"
    end

    def self.model_type_pluralized
        @@model_type_pluralized ||= "google-integrations"
    end

    def model_type(opts = {})
        should_pluralize = opts.fetch(:pluralize, true)
        should_pluralize ? GoogleIntegration.model_type_pluralized : GoogleIntegration.model_type
    end

    def credentials_json
        {}
    end

    def project_id
        google_project_id
    end


    def sync!(calling_job)

        raise ArgumentError, "Calling job is missing" if calling_job.nil?

        stats = {
            configurations_created_on_google: 0,
            configurations_modified_on_google: 0,
            configurations_created_on_rover: 0
        }

        if access_token.nil?
            raise StandardError, "Integration missing access token. Please contact support@rover.io"
        end

        if project_id.nil?
            raise StandardError, "Cannot sync unless a project_id has been specified"
        end

        client = Google::Apis::ProximitybeaconV1beta1::ProximitybeaconService.new
        client.authorization = access_token


        response = client.list_namespaces
        unformatted_namespace_name = response.namespaces.first.namespace_name
        namespace_name = unformatted_namespace_name[11..unformatted_namespace_name.length]

        #################################################################
        #                                                               #
        #   Find all configurations which need to be added to google    #
        #                                                               #
        #################################################################

        BeaconConfiguration.where(account_id: self.account_id, registered_with_google: false).includes(:place).find_in_batches(batch_size: 100) do |configurations|

            beacon_registrations = []

            configurations.each do |configuration|
                case configuration
                when IBeaconConfiguration
                    advertised_id = { id: [configuration.uuid.downcase.gsub("-", ""), configuration.major, configuration.minor].pack("H*SS"), type: "IBEACON" }
                when EddystoneNamespaceConfiguration
                    advertised_id = { id: [configuration.namespace.downcase, configuration.instance_id.downcase].pack("H*H*"), type: "EDDYSTONE" }
                else
                    advertised_id = nil
                end

                next if advertised_id.nil?

                beacon = Google::Apis::ProximitybeaconV1beta1::Beacon.new(advertised_id: advertised_id, status: "active", description: configuration.title)

                if configuration.place
                    beacon.lat_lng = { latitude: configuration.place.latitude, longitude: configuration.place.longitude }
                    beacon.place_id = configuration.place.google_place_id if configuration.place.google_place_id
                else
                    beacon.lat_lng = nil
                    beacon.place_id = nil
                end

                if beacon.indoor_level
                    beacon.indoor_level = configuration.indoor_level
                else
                    beacon.indoor_level = nil
                end

                beacon_registrations.push({ beacon: beacon, configuration: configuration })
            end

            attachment_registrations = []

            client.batch do |service|
                beacon_registrations.each do |beacon_registration|
                    beacon = beacon_registration[:beacon]
                    configuration = beacon_registration[:configuration]
                    service.register_beacon(beacon, project_id: self.project_id) do |res, err|
                        if res
                            configuration.google_beacon_name = res.beacon_name
                            configuration.google_sync_error = false
                            configuration.save
                            attachment_registrations.push(configuration)
                        elsif err
                            configuration.google_sync_error = true
                            configuration.save
                        end
                    end
                end
            end

            synced_configurations = add_rover_configuration_id_as_attachment(client, namespace_name, attachment_registrations)

            stats[:configurations_created_on_google] += BeaconConfiguration.where(id: synced_configurations.map(&:id)).update_all(registered_with_google: true)
        end

        #################################################################
        #                                                               #
        #  Find all configurations which need to push updates to google #
        #                                                               #
        #################################################################

        BeaconConfiguration.where(account_id: self.account_id, registered_with_google: true, has_pending_google_updates: true).includes(:place).find_in_batches(batch_size: 100) do |configurations|



            beacons_info = []

            client.batch do |service|
                configurations.each do |configuration|
                    service.get_beacon(configuration.google_beacon_name, project_id: self.project_id) do |res, err|
                        if res
                            beacons_info.push({ beacon: res, configuration: configuration })
                        end
                    end
                end
            end

            updated_beacons = []

            beacons_info.each do |beacon_info|
                updates = false
                beacon = beacon_info[:beacon]
                configuration = beacon_info[:configuration]

                if configuration.place
                    if beacon.lat_lng != { latitude: configuration.place.latitude, longitude: configuration.place.longitude }
                        updates = true
                        beacon.lat_lng = { latitude: configuration.place.latitude, longitude: configuration.place.longitude }
                    end

                    if beacon.place_id != configuration.place.google_place_id
                        updates = true
                        beacon.place_id = configuration.place.google_place_id
                    end
                end

                if beacon.indoor_level != configuration.indoor_level
                    updates = true
                    beacon.indoor_level = configuration.indoor_level
                end

                if updates
                    updated_beacons.push({ beacon: beacon, configuration: configuration })
                end
            end


            next if updated_beacons.empty?

            configurations_updated = []

            client.batch do |service|
                updated_beacons.each do |beacon_info|
                    beacon = beacon_info[:beacon]
                    configuration = beacon_info[:configuration]
                    service.update_beacon(beacon.beacon_name, beacon, project_id: self.project_id) do |res, err|
                        if res
                            configurations_updated.push(configuration)
                        elsif err
                            configuration.update(google_sync_error: true)
                        end
                    end
                end
            end

            stats[:configurations_modified_on_google] += BeaconConfiguration.where(id: configurations_updated.map(&:id)).update_all(has_pending_google_updates: false, google_sync_error: false)
        end

        #################################################################
        #                                                               #
        #   Find all configurations which need to be saved on rover     #
        #                                                               #
        #################################################################

        # previous_successful_sync_job = self.sync_jobs.where(status: ThirdPartyIntegrationSyncJob.statuses["finished"]).last
        # if self.sync_jobs.count == 1
        #     calling_job.started_at.to_i
        #     # this is the first time we are syncing so grab everything
        #     query = "status:active registration_time<#{calling_job.started_at.to_i}"
        # else
        #     # need the previous job
        #     previous_job = self.sync_jobs.previous
        #     if previous_job.nil?
        #         query = nil
        #     else
        #         query = "status:active registration_time>=#{previous_job.started_at.to_i}"
        #     end
        # end

        # needs fixed
        # if !query.nil?
        #     next_page_token = nil
        #     while ((response = client.list_beacons(q: query, project_id: self.project_id, page_token: next_page_token, page_size: 100)) && response.beacons) do
        #             next if response.beacons.nil?

        #             response.beacons.each do |beacon|
        #                 case beacon.advertised_id.type
        #                 when "IBEACON"
        #                     uuid, major, minor = beacon.advertised_id.unpack("H32SS")
        #                     uuid = "#{uuid[0..7]}-#{uuid[8..11]}-#{uuid[12..15]}-#{uuid[16..19]}-#{uuid[20..31]}"
        #                     begin
        #                         IBeaconConfiguration.create(
        #                             title: beacon.description || beacon.beacon_name,
        #                             uuid: uuid.upcase,
        #                             major: major,
        #                             minor: minor,
        #                             indoor_level: beacon.indoor_level,
        #                             google_beacon_name: beacon.beacon_name
        #                         )
        #                         stats[:configurations_created_on_rover] += 1
        #                     rescue ActiveRecord::RecordNotUnique => e

        #                     end
        #                 when "EDDYSTONE"
        #                     namespace, instance_id = beacon.advertised_id.unpack("H20H12")
        #                     begin
        #                         EddystoneNamespaceConfiguration.create(
        #                             title: beacon.description || beacon.beacon_name,
        #                             namespace: namespace,
        #                             instance_id: instance_id,
        #                             indoor_level: beacon.indoor_level,
        #                             google_beacon_name: beacon.beacon_name
        #                         )
        #                         stats[:configurations_created_on_rover] += 1
        #                     rescue ActiveRecord::RecordNotUnique => e
                                
        #                     end
                       
                                
        #                 end
        #             end

        #         end
        # end
        # 
        

        # play dumb and loop through all beacons on google to see if we have any new ones
        
        next_page_token = nil
        while ((response = client.list_beacons(q: "status:active", project_id: self.project_id, page_token: next_page_token, page_size: 100)) && response.beacons) do
            break if response.beacons.nil?
            next_page_token = response.next_page_token
            beacons = response.beacons
            configurations_by_beacon_name = BeaconConfiguration.where(google_beacon_name: beacons.map(&:beacon_name)).all.index_by(&:google_beacon_name)
            new_beacons = beacons.select{ |beacon| !configurations_by_beacon_name.include?(beacon.beacon_name) }

            new_configurations = []
            new_beacons.each do |beacon|
                case beacon.advertised_id.type
                when "IBEACON"
                    uuid, major, minor = beacon.advertised_id.id.unpack("H32SS")
                    uuid = "#{uuid[0..7]}-#{uuid[8..11]}-#{uuid[12..15]}-#{uuid[16..19]}-#{uuid[20..31]}"
                    new_configurations.push(
                        IBeaconConfiguration.new(
                            account_id: self.account_id,
                            title: beacon.description || beacon.beacon_name || "",
                            uuid: uuid.upcase,
                            major: major,
                            minor: minor,
                            indoor_level: beacon.indoor_level ? beacon.indoor_level.name : nil,
                            google_beacon_name: beacon.beacon_name,
                            registered_with_google: true,
                            has_pending_google_updates: false,
                        )
                    )
                when "EDDYSTONE"
                    namespace, instance_id = beacon.advertised_id.id.unpack("H20H12")
                    new_configurations.push(
                        EddystoneNamespaceConfiguration.new(
                            account_id: self.account_id,
                            title: beacon.description || beacon.beacon_name || "",
                            namespace: namespace, 
                            instance_id: instance_id,
                            indoor_level:  beacon.indoor_level ? beacon.indoor_level.name : nil,
                            google_beacon_name: beacon.beacon_name,
                            registered_with_google: true,
                            has_pending_google_updates: false,
                        )
                    )
                end
            end

            created_configurations = []
            new_configurations.each do |configuration|
                begin
                    configuration.save
                    stats[:configurations_created_on_rover] += 1
                    created_configurations.push(configuration)
                rescue ActiveRecord::RecordNotUnique => e
                end
            end

            add_rover_configuration_id_as_attachment(client, namespace_name, created_configurations)
        end

        return stats
    end


    def access_token
        return nil if credentials.nil? || !([:client_id, :scope, :access_token, :refresh_token, :expiration_time_millis].all? { |property| credentials.has_key?(property) })
        # grab the url
        token = Google::Auth::UserRefreshCredentials.new(
            client_id: GoogleOauthSettings.client_id.id,
            client_secret: GoogleOauthSettings.client_id.secret,
            scope: credentials[:scope] || GoogleOauthSettings.default_scope,
            access_token: credentials[:access_token],
            refresh_token: credentials[:refresh_token],
            expires_at: credentials.fetch(:expiration_time_millis, 0) / 1000
        )

        if Time.zone.now > token.expires_at
            token.refresh!
            
            new_credentials = {
                project_id: self.project_id,
                client_id: token.client_id,
                access_token: token.access_token,
                refresh_token: token.refresh_token,
                scope: token.scope,
                expiration_time_millis: (token.expires_at.to_i) * 1000
            }
            credentials = new_credentials
            save!
            # self.update(credentials: new_credentials)

        end

        return token
    end

    private

    private

    def add_rover_configuration_id_as_attachment(client, namespace_name, configurations)
        return [] if configurations.nil? || configurations.empty?
        synced_configurations = []
        client.batch do |service|
            configurations.each do |configuration|
                beacon_name = configuration.google_beacon_name
                attachment = Google::Apis::ProximitybeaconV1beta1::BeaconAttachment.new(namespaced_type: "#{namespace_name}/rover-configuration-id", data: configuration.id.to_s)
                service.create_beacon_attachment(beacon_name, attachment) do |res, err|
                    if res
                        synced_configurations.push(configuration)
                    end
                end
            end
        end
        return synced_configurations
    end

    # make sure the project_id hasn't gone from one project to another
    def did_not_switch_projects
        if @switched_projects == true
            errors.add(:project_id, "cannot switch between projects")
            return false
        end
    end

    def revoke_access_token
        return if access_token.nil?
        access_token.revoke!
    end


end
