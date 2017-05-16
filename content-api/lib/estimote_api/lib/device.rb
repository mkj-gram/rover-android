module EstimoteApi
    class IBeaconAdvertiser
        include Virtus.model

        attribute :name, String
        attribute :enabled, Boolean, default: true
        attribute :uuid, String
        attribute :major, Integer
        attribute :minor, Integer
        attribute :power, Integer
        attribute :interval, Integer

        def initialize(atr = {})
            atr["uuid"] = atr["uuid"].upcase if atr["uuid"]
            super atr
        end
    end

    class EddystoneUIDAdvertiser
        include Virtus.model

        attribute :name, String
        attribute :enabled, Boolean
        attribute :interval, Integer
        attribute :power, Integer
        attribute :instance_id, String
        attribute :namespace_id, String

        def initialize(atr = {})
            atr["instance_id"] = atr["instance_id"].upcase if atr["instance_id"]
            atr["namespace_id"] = atr["namespace_id"].upcase if atr["namespace_id"]
            super atr
        end
    end


    class Device
        include Virtus.model


        attribute :identifier, String
        attribute :name, String
        attribute :tags, Array[String]
        # Hardware settings

        attribute :hardware_type, String
        attribute :hardware_revision, String
        attribute :color, String
        attribute :form_factor, String
        attribute :firmware_version, String

        attribute :battery_percentage, Float
        attribute :estimated_battery_lifetime, Integer


        attribute :ibeacon_advertiser, IBeaconAdvertiser
        attribute :eddystone_uid_advertiser, EddystoneUIDAdvertiser

        def initialize(atr = {})

            if atr.has_key?("settings") && atr["settings"].has_key?("advertisers")
                advertisers = atr["settings"].delete("advertisers")
                ibeacon = advertisers.has_key?("ibeacon") ? advertisers["ibeacon"].first : nil
                eddystone_uid = advertisers.has_key?("eddystone_uid") ? advertisers["eddystone_uid"].first : nil
                atr.merge!("ibeacon_advertiser" => ibeacon)
                atr.merge!("eddystone_uid_advertiser" => eddystone_uid)
            end

            if atr.has_key?("shadow")
                shadow = atr.delete("shadow")
                atr.merge!("id" => shadow["id"])
                atr.merge!("name" => shadow["name"])
                atr.merge!("tag" => shadow["tags"])
            end

            if atr.has_key?("status_report")
                status_report = atr.delete("status_report")
                atr.merge!("battery_percentage" => status_report["battery_percentage"])
                atr.merge!("estimated_battery_lifetime" => status_report["estimated_battery_lifetime"])
                atr.merge!("firmware_version" => status_report["firmware_version"])
            end

            super atr
        end
    end
end
