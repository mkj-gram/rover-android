module V1::XenioPlaceSerializer
    class << self
        def serialize(xenio_place)
            {
                type: "xenio-places",
                id: xenio_place.id.to_s,
                attributes: {
                    :"name" => xenio_place.name,
                    :"tags" => xenio_place.tags
                }
            }
        end
    end
end
