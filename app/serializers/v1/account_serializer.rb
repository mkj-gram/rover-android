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

        private

        def serialize(object)
            {
                "id"=> object.id.to_s,
                "type"=> "accounts",
                "attributes"=> {
                    "title"=> object.title,
                    "token"=> object.token
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
