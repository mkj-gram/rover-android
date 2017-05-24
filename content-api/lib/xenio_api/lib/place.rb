module XenioApi
    class Place

        attr_accessor :id, :name, :tags

        def initialize(opts)
            @id = opts["placeid"]
           	@name = opts["name"]
           	@tags = opts["tags"]
        end

    end
end
