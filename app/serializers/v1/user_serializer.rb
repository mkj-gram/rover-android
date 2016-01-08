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
                "id"=> object.id,
                "type"=> "users",
                "attributes"=> {
                    "name"=> object.name,
                    "email"=> object.email,
                    "created_at"=> object.created_at,
                    "updated_at"=> object.updated_at
                }
            }
        end

        def serialize_relationship(object)
            {
                "user"=> {
                    "data"=> {
                        "id"=> object.id,
                        "type"=> "users"
                    }
                }
            }
        end
    end
end
