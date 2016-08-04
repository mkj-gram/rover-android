module EstimoteApi
    class Client
        include HTTParty
        base_uri "https://cloud.estimote.com/v2"
        format :json
        headers 'Accept' => 'application/json'

        def initialize(app_id, app_token)
            self.class.basic_auth(app_id, app_token)
        end


        def devices(options = {})
            response = self.class.get('/devices', options)
            if response.response.code == "200"
                parsed_devices = response.parsed_response
                estimote_devices = parsed_devices.map!{|config| Device.new(config)}
                return parsed_devices
            elsif response.response.code == "403" || response.response.code == "401"
                raise EstimoteApi::Errors::Unauthorized, "invalid credentials"
            else
                []
            end
        end
    end
end
