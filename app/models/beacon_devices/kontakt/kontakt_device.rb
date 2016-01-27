class KontaktDevice < BeaconDevice

    attr_accessor :skip_cache_update

    store_accessor :device_data, :specification, :name, :battery, :interval, :firmware, :power, :uniqueId

    validates :uniqueId, presence: true

    before_create :set_manufacturer_id


    def self.attributes_for_beacon(device)
        {
            manufacturer_id: device.uniqueId,
            uniqueId: device.uniqueId,
            specification: device.specification,
            name: device.name,
            battery: device.battery,
            interval: device.interval,
            firmware: device.firmware,
            power: device.power
        }
    end

    def needs_update?(other)
        !(
            self.specification == other.specification &&
            self.name        == other.name &&
            self.battery     == other.battery &&
            self.interval    == other.interval &&
            self.firmware    == other.firmware &&
            self.power       == other.power
        )
    end

    def overwrite_attributes_with_device(other)
        self.specification = other.specification
        self.name       = other.name
        self.battery    = other.battery
        self.interval   = other.interval
        self.firmware   = other.firmware
        self.power      = other.power
    end

    def manufacturer
        return "kontakt"
    end

    def manufacturer_model
        return "kontakt-#{self.specification}"
    end

    def skip_cache_update
        @skip_cache_update.nil? ? false : @skip_cache_update
    end

    private

    def set_manufacturer_id
        self.manufacturer_id = self.uniqueId
    end

end
