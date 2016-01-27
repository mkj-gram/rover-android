module EddystoneNamespaceDevice
    extend ActiveSupport::Concern

    included do
        include EddystoneNamespaceAttributes

        before_save :update_beacon_configuration
    end

    class_methods do
        def attributes_for_beacon(beacon)
            {
                namespace: beacon.namespace,
                instance_id: beacon.instance_id,

            }.merge(super)
        end

        def build_from_beacon(beacon)
            return self.new(self.attributes_for_beacon(beacon))
        end
    end

    def configuration
        EddystoneNamespaceConfiguration.where(namespace: self.namespace, instance_id: self.instance_id).first
    end

    def create_configuration(account_id)
        configuration = EddystoneNamespaceConfiguration.where(namespace: self.namespace, instance_id: self.instance_id).limit(1)[0]
        if configuration.nil?
            configuration = EddystoneNamespaceConfiguration.new(account_id: account_id, namespace: self.namespace, instance_id: self.instance_id, title: self.configuration_name)
            configuration.save
        end
        return configuration
    end


    private

    def update_beacon_configuration
        if self.skip_cache_update == false && (namespace_changed? || instance_id_changed?)
            configuration = EddystoneNamespaceConfiguration.where(namespace: self.namespace, instance_id: self.instance_id).first
            configuration.update({beacon_devices_updated_at: DateTime.now}) if configuration
        end
    end
end
