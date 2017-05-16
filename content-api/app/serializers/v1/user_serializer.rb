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

        

        def serialize(object)
            {
                "id"=> object.id.to_s,
                "type"=> "users",
                "attributes"=> {
                    "name"=> object.name,
                    "email"=> object.email
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
