module V1::XenioZoneSerializer
    class << self
        def serialize(xenio_zone)
            {
                type: "xenio-zones",
                id: xenio_zone.id.to_s,
                attributes: {
                    :"name" => xenio_zone.name,
                    :"tags" => xenio_zone.tags,
                    :"place-id" => xenio_zone.place_id
                }
            }
        end
    end
end
