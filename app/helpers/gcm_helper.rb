module GcmHelper

    class << self
        INVALID_REGISTRATION = "InvalidRegistration".freeze
        NOT_REGISTERED = "NotRegistered".freeze

        def send(gcm_app, inbox_messages_by_token, devices)

            client = GCM.new(gcm_app.api_key)
            expired_tokens = []

            devices.each do |device|
                response = client.send([device.token], { data: payload_from_inbox_message(inbox_messages_by_token[device.token]) })
                body = JSON.parse(response[:body])
                if body.has_key?("failure") && body["failure"] > 0
                    body["results"].each do |result|
                        if result.has_key?("error") && (result["error"] == INVALID_REGISTRATION || result["error"] == NOT_REGISTERED)
                            expired_tokens.push(device.token)
                        end
                    end
                end
            end

            return expired_tokens
        end


        def payload_from_inbox_message(inbox_message)
            V1::InboxMessageSerializer.serialize(inbox_message)
        end

    end

end
