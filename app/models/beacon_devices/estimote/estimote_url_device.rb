class EstimoteUrlDevice < EstimoteDevice
    include UrlAttributes

    validates :url, presence: true

    before_save :update_beacon_configuration


    def self.attributes_for_beacon(beacon)
        {
            url: beacon.url

        }.merge(super)
    end

    def self.build_from_beacon(beacon)
        return EstimoteUrlDevice.new(self.attributes_for_beacon(beacon))
    end

    def needs_update?(other)
        !(self.url != other.url) || super(other)
    end

    def overwrite_attributes_with_device(other)
        self.url   = other.url
        super(other)
    end

    def configuration
        UrlConfiguration.where(url: self.url).first
    end

    def create_configuration(account_id)
        configuration = IBeaconConfiguration.where(namespace: self.namespace, instance_id: self.instance_id).limit(1)[0]
        if configuration.nil?
            configuration = IBeaconConfiguration.new(account_id: account_id, namespace: self.namespace, instance_id: self.instance_id, title: self.name)
            configuration.save
        end
        return configuration
    end

    private

    def url_changed?
        changes.include?(:url)
    end

    def update_beacon_configuration
        if skip_cache_update == false && url_changed?
            configuration = EstimoteUrlDevice.where(url: self.url).first
            configuration.update({beacon_devices_updated_at: DateTime.now})
        end
    end
end
