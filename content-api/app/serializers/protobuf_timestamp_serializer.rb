module ProtobufTimestampSerializer
    class << self
        def serialize(timestamp)
            if timestamp
                return Time.zone.at(timestamp.seconds).iso8601(3)
            else
                return nil
            end
        end
    end
end