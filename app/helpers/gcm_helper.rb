module GcmHelper

    class << self
        INVALID_REGISTRATION = "InvalidRegistration".freeze

        def send(gcm_app, notification, devices)
            client = GCM.new(gcm_app.api_key)
            registration_ids = devices.map(&:token)
            options = {data: {score: "123", collapase_key: "updated_score"}}
            response = client.send(registration_ids, options)
            if response[:status_code] != 200
                expired_tokens = []
                results = JSON.parse(response[:body])["results"]

                results.each_with_index do |result, position|
                    if result.has_key?("error") && result["error"] == INVALID_REGISTRATION
                        expired_tokens.push(registration_ids[position])
                    end
                end

                return expired_tokens
            else
                return []
            end
        end
    end

end
