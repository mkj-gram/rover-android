class EstimoteDevice < BeaconDevice
    # what is common between all devices regardless of their scheme
    # each estimote device have these in common
    # color, name, battery, interval, firmware, range, power, mac_id
    #
    #
    attr_accessor :skip_cache_update

    store_accessor :device_data, :color, :name, :battery, :interval, :firmware, :range, :power, :mac, :battery_life_expectancy_in_days

    validates :mac, presence: true

    before_create :set_manufacturer_id


    def self.attributes_for_beacon(beacon)
        {
            manufacturer_id: beacon.mac.downcase,
            color: beacon.color,
            name: beacon.name,
            battery: beacon.battery,
            interval: beacon.interval,
            firmware: beacon.firmware,
            range: beacon.range,
            power: beacon.power,
            mac: beacon.mac,
            battery_life_expectancy_in_days: beacon.battery_life_expectancy_in_days,
        }
    end

    def needs_update?(other)
        !(
            self.color       == other.color &&
            self.name        == other.name &&
            self.battery     == other.battery &&
            self.interval    == other.interval &&
            self.firmware    == other.firmware &&
            self.range       == other.range &&
            self.power       == other.power &&
            self.battery_life_expectancy_in_days == other.battery_life_expectancy_in_days
        )
    end

    def overwrite_attributes_with_device(other)
        self.color      = other.color
        self.name       = other.name
        self.battery    = other.battery
        self.interval   = other.interval
        self.firmware   = other.firmware
        self.range      = other.range
        self.power      = other.power
        self.battery_life_expectancy_in_days = other.battery_life_expectancy_in_days
    end

    def device_attributes
        {
            color: self.color,
            name: self.name,
            battery: self.battery,
            interval: self.interval,
            firmware: self.firmware,
            range: self.range,
            power: self.power,
            mac: self.mac.scan(/.{1,2}/).map(&:upcase).join(":"),
            :"battery-life-expectancy-in-days" => self.battery_life_expectancy_in_days,
        }
    end

    def model_type
        return "estimote-devices"
    end

    def manufacturer
        return "estimote"
    end

    def manufacturer_model
        return "estimote-#{self.color}"
    end

    def configuration_name
        self.name
    end

    def skip_cache_update
        @skip_cache_update.nil? ? false : @skip_cache_update
    end

    private



    def set_manufacturer_id
        self.manufacturer_id = self.mac.downcase
    end


end
