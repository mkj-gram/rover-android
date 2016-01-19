class EstimoteIntegration < ThirdPartyIntegration


    validates :app_id, presence: true
    validates :app_token, presence: true


    def self.model_type
        @@model_type ||= "estimote-integrations"
    end

    def model_type
        EstimoteIntegration.model_type
    end

    def set_credentials(app_id, app_token)
        if !app_id.nil? && !app_token.nil?
            self.credentials = {app_id: app_id, app_token: app_token}
        end
        # if app_id.nil?
        #     errors.add(:"app-id", "can't be blank")
        # end
        # if app_token.nil?
        #     errors.add(:"app-token", "can't be blank")
        # end
        return
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

    def sync!
        # this method syncs the integration with the account
        client = EstimoteApi.new(app_id, app_token)
        beacons = client.beacons
        # we need to look in the users account
        beacons.each do |beacon|
            if beacon.ibeacon?
                save_ibeacon_configuration(beacon)
            elsif beacon.eddystone_namespace?
                save_eddystone_namespace_configuration(beacon)
            elsif beacon.url?
                save_url_configuration(beacon)
            else
                Rails.logger.warn("Unknown beacon type #{beacon.protocol}")
            end
        end
    end

    private

    def save_ibeacon_configuration(beacon)
        if !IBeaconConfiguration.where(uuid: beacon.uuid, major: beacon.major, minor: beacon.minor).exists?
            configuration = IBeaconConfiguration.new(account_id: account_id, uuid: beacon.uuid, major: beacon.major, minor: beacon.minor, title: beacon.name)
            configuration.save
        end
    end

    def save_eddystone_namespace_configuration(beacon)
        if !EddystoneNamespaceConfiguration.where(namespace: beacon.eddystone_namespace, instance_id: beacon.eddystone_instance_id).exists?
            configuration = EddystoneNamespaceConfiguration.new(namespace: beacon.eddystone_namespace, instance_id: beacon.eddystone_instance_id)
            configuration.save
        end
    end

    def save_url_configuration(beacon)
        # we don't autosave for now
    end

end
