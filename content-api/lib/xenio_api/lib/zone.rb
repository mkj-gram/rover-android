module XenioApi
    class Zone

        attr_accessor :id, :name, :place_id, :tags

        def initialize(opts)
            @id = opts["zoneid"]
           	@name = opts["name"]
           	@place_id = opts["placeid"]
           	@tags = opts["tags"]
        end

    end
end
