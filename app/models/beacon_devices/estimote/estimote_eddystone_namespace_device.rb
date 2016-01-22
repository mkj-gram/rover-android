class EstimoteEddystoneNamespaceDevice < EstimoteDevice

    validates :namespace, presence: true
    validates :instance_id, presence: true

    before_save :update_beacon_configuration


    def self.attributes_for_beacon(beacon)
        {
            namespace: beacon.namespace,
            instance_id: beacon.instance_id,

        }.merge(super)
    end

    def self.build_from_beacon(beacon)
        return EstimoteEddystoneNamespaceDevice.new(self.attributes_for_beacon(beacon))
    end

    private

    def namespace_changed?
        changes.include?(:namespace)
    end

    def instance_id_changed?
        changes.include?(:instance_id)
    end


    def update_beacon_configuration
        if skip_cache_update == false && (namespace_changed? || instance_id_changed?)
            configuration = EddystoneNamespaceConfiguration.where(namespace: self.namespace, instance_id: self.instance_id).first
            configuration.update({beacon_devices_updated_at: DateTime.now})
        end
    end
end
