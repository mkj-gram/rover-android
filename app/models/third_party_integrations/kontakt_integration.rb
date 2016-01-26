class KontaktIntegration < ThirdPartyIntegration

    validates :api_key, presence: true


    def self.model_type
        @@model_type ||= "kontakt-integration"
    end

    def self.model_type_pluralized
        @@model_type_pluralized ||= "kontakt-integrations"
    end

    def model_type(opts = {})
        should_pluralize = opts.fetch(:pluralize, true)
        should_pluralize ? KontaktIntegration.model_type_pluralized : KontaktIntegration.model_type
    end

    def set_credentials(api_key)
        if !api_key.nil?
            self.credentials = {api_key: api_key}
        end
        return
    end

    def api_key
        if self.credentials
            self.credentials[:api_key]
        else
            nil
        end
    end

    def client
        @client ||= KontaktApi.new(api_key)
    end

    def sync!
        # this one could page maybe the api just grabs all of it?
        client.devices
    end


    private

    def save_ibeacon_configuration(beacon)
        configuration = IBeaconConfiguration.where(uuid: beacon.uuid, major: beacon.major, minor: beacon.minor).first
        if configuration.nil?
            configuration = IBeaconConfiguration.new(account_id: account_id, uuid: beacon.uuid, major: beacon.major, minor: beacon.minor, title: beacon.name)
            configuration.save
        end
        return configuration
    end

    def save_eddystone_namespace_configuration(beacon)
        configuration = EddystoneNamespaceConfiguration.where(namespace: beacon.eddystone_namespace, instance_id: beacon.eddystone_instance_id).first
        if configuration.nil?
            configuration = EddystoneNamespaceConfiguration.new(account_id: account_id, namespace: beacon.eddystone_namespace, instance_id: beacon.eddystone_instance_id, title: beacon.title)
            configuration.save
        end
        return configuration
    end
end
