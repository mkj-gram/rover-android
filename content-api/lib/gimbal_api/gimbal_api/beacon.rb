module GimbalApi
    class Beacon

        attr_reader :id, :factory_id, :name

        def initialize(opts)
            @id = opts["id"]
            @factory_id = opts["factoryId"]
            @name = opts["name"]
        end

    end
end
