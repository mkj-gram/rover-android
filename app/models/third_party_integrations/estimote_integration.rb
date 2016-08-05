class EstimoteIntegration < ThirdPartyIntegration

    validates :app_id, presence: true
    validates :app_token, presence: true

    after_create :create_sync_job!
    after_destroy :remove_all_devices

    has_many :sync_jobs, class_name: "EstimoteSyncJob", foreign_key:  "third_party_integration_id" do
        def latest
            last
        end
    end

    def self.model_type
        @@model_type ||= "estimote-integration"
    end

    def self.model_type_pluralized
        @@model_type_pluralized ||= "estimote-integrations"
    end

    def model_type(opts = {})
        should_pluralize = opts.fetch(:pluralize, true)
        should_pluralize ? EstimoteIntegration.model_type_pluralized : EstimoteIntegration.model_type
    end

    def set_credentials(app_id, app_token)
        self.credentials = {app_id: app_id, app_token: app_token}
    end

    def app_id
        if self.credentials
            self.credentials[:app_id]
        else
            nil
        end
    end

    def app_token
        if self.credentials
            self.credentials[:app_token]
        else
            nil
        end
    end

    def credentials_json
        {
            "app-id" => self.app_id,
            "app-token" => self.app_token
        }
    end

    def client
        @client ||= EstimoteApi.new(app_id, app_token)
    end

    def sync!(calling_job = nil)

        stats = {
            added_beacons_count: 0,
            modified_beacons_count: 0,
            removed_beacons_count: 0,
            beacons_changed_configuration_count: 0
        }


        estimote_devices = client.devices
        current_devices = self.beacon_devices.all

        new_configurations = Set.new
        # estimote_devices now hold multiple broadcasting signals

        # we want to match the estimote with the ones we have by their identifier

        estimote_devices_by_identifier = estimote_devices.index_by(&:identifier)
        current_devices_by_identifier = current_devices.index_by(&:manufacturer_id)

        # new devices are ones we don't have
        new_estimote_devices = estimote_devices_by_identifier.select{|identifier, device| current_devices_by_identifier[identifier].nil? }

        new_estimote_devices.each do |identifier, device|
            # this can map to multiple configurations
            rover_estimote_device = EstimoteDevice.build_from_estimote_device(device)
            rover_estimote_device.account_id = self.account_id
            rover_estimote_device.third_party_integration_id = self.id
            if rover_estimote_device.save
                stats[:added_beacons_count] += 1
                if rover_estimote_device.ibeacon_enabled?
                    new_configurations.add({uuid: rover_estimote_device.uuid, major: rover_estimote_device.major, minor: rover_estimote_device.minor, tags: rover_estimote_device.tags, title: rover_estimote_device.name})
                end

                if rover_estimote_device.eddystone_uid_enabled?
                    new_configurations.add({ namespace: rover_estimote_device.namespace, instance_id: rover_estimote_device.instance_id, tags: rover_estimote_device.tags, title: rover_estimote_device.name })
                end
            end
        end

        new_configurations.each do |configuration_opts|

            configuration_opts.merge!(account_id: self.account_id)

            if configuration_opts.has_key?(:uuid)
                configuration = IBeaconConfiguration.new(configuration_opts)
            else
                configuration = EddystoneNamespaceConfiguration.new(configuration_opts)
            end
            
            configuration.save!
        end


        modified_devices = current_devices_by_identifier.select { |identifier, rover_estimote_device| !estimote_devices_by_identifier[identifier].nil? && rover_estimote_device.needs_update?(estimote_devices_by_identifier[identifier]) }


        # need a way to detect which ones just need updating to their settings
        # and which ones configurations changed
        modified_devices.each do |identifier, rover_estimote_device|

            estimote_device = estimote_devices_by_identifier[identifier]
            rover_estimote_device.merge_new_settings(estimote_device)

            ibeacon_configuration_changed = rover_estimote_device.ibeacon_configuration_changed?
            eddystone_uid_configuration_changed = rover_estimote_device.eddystone_uid_configuration_changed?
            if rover_estimote_device.changes.any? && rover_estimote_device.save
                stats[:modified_beacons_count] += 1

                if ibeacon_configuration_changed
                    stats[:beacons_changed_configuration_count] += 1
                end

                if eddystone_uid_configuration_changed
                    stats[:beacons_changed_configuration_count] += 1
                end
            end
        end

        removed_devices = current_devices_by_identifier.select{ |identifier, rover_estimote_device| estimote_devices_by_identifier[identifier].nil? }

        removed_devices.each do |identifier, rover_estimote_device|
            if rover_estimote_device.destroy
                stats[:removed_beacons_count] += 1
            end
        end



        return stats
    end

end
