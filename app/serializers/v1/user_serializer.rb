module V1::UserSerializer
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
                "type"=> "users",
                "attributes"=> {
                    "name"=> object.name,
                    "email"=> object.email,
                    "created-at"=> object.created_at,
                    "updated-at"=> object.updated_at
                }
            }
        end

        def serialize_relationship(object)
            {
                "user"=> {
                    "data"=> {
                        "id"=> object.id.to_s,
                        "type"=> "users"
                    }
                }
            }
        end
    end
end
