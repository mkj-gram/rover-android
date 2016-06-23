module V1::AccountSerializer
    class << self

        def s(object, options = {})
            relationship = options.delete(:relationships)
            if relationship
                serialize_relationship(object)
            else
                serialize(object)
            end
        end


        def serialize(account)
            {
                "id" => account.id.to_s,
                "type" => "accounts",
                "attributes" => {
                    "title" => account.title,
                    "token" => account.token,
                    "share-key" => account.share_key,
                    "configuration-tags" => account.beacon_configuration_active_tag.tags,
                    "place-tags" => account.place_active_tag.tags,
                    "ibeacon-uuids" => account.ibeacon_configuration_uuids.configuration_uuids,
                    "eddystone-namespaces" => account.eddystone_namespace_configuration_uuids.configuration_uuids,
                    "message-limits" => account.message_limits.map{|limit| V1::MessageLimitSerializer.serialize(limit)}
                }
            }
        end

        def serialize_relationship(object)
            {
                "account"=> {
                    "data"=> {
                        "id"=> object.id.to_s,
                        "type"=> "accounts"
                    }
                }
            }
        end
    end
end
