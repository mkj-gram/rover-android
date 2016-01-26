module IBeaconDevice
    extend ActiveSupport::Concern

    included do
        include IBeaconAttributes
        before_save :update_beacon_configuration
    end

    class_methods do
        def attributes_for_beacon(beacon)
            {
                uuid: beacon.uuid,
                major: beacon.major,
                minor: beacon.minor

            }.merge(super)
        end

        def build_from_beacon(beacon)
            return self.new(self.attributes_for_beacon(beacon))
        end
    end

    #
    # Object Methods
    #
    def overwrite_attributes_with_device(other)
        self.uuid   = other.uuid
        self.major  = other.major
        self.minor  = other.minor
        super(other)
    end

    def configuration
        IBeaconConfiguration.where(uuid: self.uuid, major: self.major, minor: self.minor).first
    end

    def needs_update?(other)
        !(self.uuid == other.uuid && self.major == other.major && self.minor == other.minor) || super(other)
    end

    def create_configuration(account_id)
        configuration = IBeaconConfiguration.where(uuid: self.uuid, major: self.major, minor: self.minor).limit(1)[0]
        if configuration.nil?
            configuration = IBeaconConfiguration.new(account_id: account_id, uuid: self.uuid, major: self.major, minor: self.minor, title: self.name)
            configuration.save
        end
        return configuration
    end

    private

    def update_beacon_configuration
        if skip_cache_update == false && (uuid_changed? || major_changed? || minor_changed?)
            configuration = IBeaconConfiguration.where(uuid: self.uuid, major: self.major, minor: self.minor).first
            configuration.update({beacon_devices_updated_at: DateTime.now})
        end
    end

end
