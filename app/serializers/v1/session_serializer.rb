module V1::SessionSerializer
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
                "id"=> object.id,
                "type"=> "sessions",
                "attributes"=> {
                    "token"=> object.token,
                    "expires_at"=> object.expires_at
                }
            }
        end

        def serialize_relationship(object)
            {
                "user"=> {
                    "data"=> {
                        "id"=> object.id,
                        "type"=> "sessions"
                    }
                }
            }
        end
    end
end
