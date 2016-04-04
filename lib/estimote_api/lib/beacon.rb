module EstimoteApi
    class Beacon
        attr_reader :id, :uuid, :major, :minor, :mac, :mac_address, :color, :name, :battery_life_expectancy_in_days
        def initialize(config)
            @id = config["id"]
            @uuid = config["uuid"]
            @major = config["major"]
            @minor = config["minor"]
            @mac = config["mac"]
            @mac_address = @mac.scan(/.{1,2}/).map(&:upcase).join(":")
            @color = config["color"]
            @name = config["name"]
            @battery_life_expectancy_in_days = config["battery_life_expectancy_in_days"]
            @settings = Settings.new(config["settings"])
        end

        def ibeacon?
            settings.ibeacon_broadcasting_scheme?
        end

        def eddystone_namespace?
            settings.eddystone_broadcasting_scheme?
        end

        def url?
            settings.url_broadcasting_scheme?
        end

        def eddystone_namespace
            settings.eddystone_namespace_id
        end

        def namespace
            settings.eddystone_namespace
        end

        def eddystone_instance_id
            settings.eddystone_instance_id
        end

        def instance_id
            setting.eddystone_instance_id
        end

        def url
            settings.url
        end

        def protocol
            settings.broadcasting_scheme
        end

        def battery
            settings.battery
        end

        def interval
            settings.interval
        end

        def firmware
            settings.firmware
        end

        def range
            settings.range
        end

        def power
            settings.power
        end


        private

        def settings
            @settings
        end


        class Settings
            attr_reader :battery, :interval, :firmware, :range, :power, :battery_life_expectancy_in_days
            attr_reader :broadcasting_scheme, :eddystone_namespace_id, :eddystone_instance_id, :url

            def initialize(config)
                @broadcasting_scheme = config["broadcasting_scheme"]
                @eddystone_instance_id = config["eddystone_instance_id"]
                @eddystone_namespace_id = config["eddystone_namespace_id"]
                @url = config["eddystone_url"]


                @battery = config["battery"]
                @interval = config["interval"]
                @firmware = config["firmware"]
                @range = config["range"]
                @power = config["power"]
            end

            def ibeacon_broadcasting_scheme?
                @broadcasting_scheme == "estimote" || @broadcasting_scheme == "ibeacon"
            end

            def eddystone_broadcasting_scheme?
                @broadcasting_scheme == "eddystone_uid"
            end

            def url_broadcasting_scheme?
                @broadcasting_scheme == "eddystone_url"
            end

        end
    end
end
# settings"=>{"battery"=>100, "interval"=>950, "hardware"=>"D3.4", "firmware"=>"A3.0.1", "basic_power_mode"=>false, "smart_power_mode"=>true, "timezone"=>"America/Toronto", "scheduling"=>false, "scheduling_config"=>"0", "scheduling_period"=>"0", "security"=>false, "motion_detection"=>true, "conditional_broadcasting"=>"off", "latitude"=>nil, "longitude"=>nil, "location_id"=>nil, "clock_offset"=>nil, "created_at"=>"2016-01-19T17:08:22.190Z", "synced_at"=>"2016-01-19T17:08:22.160Z", "broadcasting_scheme"=>"estimote", "range"=>-12, "power"=>-12, "firmware_deprecated"=>false, "firmware_newest"=>true, "location"=>nil}, "color"=>"white", "context_id"=>165978, "name"=>"Red", "battery_life_expectancy_in_days"=>1168, "tags"=>[]}
