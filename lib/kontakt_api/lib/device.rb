class Device
    attr_reader :id, :uniqueId, :device_type, :specification, :uuid, :major, :minor, :namespace, :instance_id, :name, :alias, :interval, :firmware, :power, :battery

    def initialize(config)
        @id = config["id"]
        @uniqueId = config["uniqueId"]
        @device_type = config["deviceType"]
        @specification = ActiveSupport::StringInquirer.new(config["specification"].downcase)
        @uuid = config["proximity"].upcase
        @major = config["major"]
        @minor = config["minor"]
        @name = config["name"]
        @alias = config["alias"]
        @namespace = config["namespace"]
        @instance_id = config["instanceId"]
        @profile = ActiveSupport::StringInquirer.new(config["profiles"].first.downcase)
        @interval = config["interval"]
        @firmware = config["firmware"]
        @power = config["txPower"]
        @battery = config["batteryLevel"]
    end

    def ibeacon?
        @profile.ibeacon?
    end

    def eddystone_namespace?
        @profile.eddystone?
    end

    def url
        false
    end

end
