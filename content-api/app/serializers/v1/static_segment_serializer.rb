module V1::StaticSegmentSerializer
    class << self
        def serialize(model)
            {
                type: "static-segments",
                id: model.id.to_s,
                attributes: {
                   name: model.title,
                   size: model.size,
                   :"updated-at" => ProtobufTimestampSerializer.serialize(model.updated_at),
                   :"created-at" => ProtobufTimestampSerializer.serialize(model.created_at)
                }
            }
        end
    end
end
