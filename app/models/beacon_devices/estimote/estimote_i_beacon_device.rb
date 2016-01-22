class EstimoteIBeaconDevice < EstimoteDevice
    include IBeaconAttributes

    validates :uuid, presence: true
    validates :major, presence: true
    validates :minor, presence: true

    before_save :update_beacon_configuration


    def self.attributes_for_beacon(beacon)
        {
            uuid: beacon.uuid,
            major: beacon.major,
            minor: beacon.minor

        }.merge(super)
    end

    def self.build_from_beacon(beacon)
        return EstimoteIBeaconDevice.new(self.attributes_for_beacon(beacon))
    end

    def needs_update?(other)
        !(self.uuid == other.uuid && self.major == other.major && self.minor == other.minor) || super(other)
    end

    def overwrite_attributes_with_device(other)
        self.uuid   = other.uuid
        self.major  = other.major
        self.minor  = other.minor
        super(other)
    end

    def configuration
        IBeaconConfiguration.where(uuid: self.uuid, major: self.major, minor: self.minor).first
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

    def uuid_changed?
        changes.include?(:uuid)
    end

    def major_changed?
        changes.include?(:major)
    end

    def minor_changed?
        changes.include?(:minor)
    end

    def update_beacon_configuration
        if skip_cache_update == false && (uuid_changed? || major_changed? || minor_changed?)
            configuration = IBeaconConfiguration.where(uuid: self.uuid, major: self.major, minor: self.minor).first
            configuration.update({beacon_devices_updated_at: DateTime.now})
        end
    end
end
