module V1::AccountInviteSerializer
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
                "type"=> "account_invites",
                "attributes"=> {
                    "invited_email" => object.invited_email,
                    "issuer_id" => object.issuer_id.to_s,
                    "created_at"=> object.created_at,
                }
            }
        end

        def serialize_relationship(object)
            {
                "account_invite"=> {
                    "data"=> {
                        "id"=> object.id.to_s,
                        "type"=> "account_invites"
                    }
                }
            }
        end
    end
end
