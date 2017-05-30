class KontaktDevice < BeaconDevice

    attr_accessor :skip_cache_update

    store_accessor :device_data, :specification, :name, :alias, :battery, :interval, :firmware, :power, :uniqueId

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
            power: device.power,
            alias: device.alias,
        }
    end

    def needs_update?(other)
        !(
            self.specification == other.specification &&
            self.name        == other.name &&
            self.battery     == other.battery &&
            self.interval    == other.interval &&
            self.firmware    == other.firmware &&
            self.power       == other.power &&
            self.alias       == other.alias
        )
    end

    def overwrite_attributes_with_device(other)
        self.specification = other.specification
        self.name       = other.name
        self.battery    = other.battery
        self.interval   = other.interval
        self.firmware   = other.firmware
        self.power      = other.power
        self.alias      = other.alias
    end

    def device_attributes
        {
            :"unique-id" => self.uniqueId,
            specification: self.specification,
            name: self.name,
            battery: self.battery,
            interval: self.interval,
            firmware: self.firmware,
            power: self.power,
            alias: self.alias,
        }
    end

    def configuration_name
        self.alias.nil? ? self.uniqueId : self.alias
    end

    def model_type
        return "kontakt-beacons"
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