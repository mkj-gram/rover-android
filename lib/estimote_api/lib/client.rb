module EstimoteApi
    class Client
        include HTTParty
        base_uri "https://cloud.estimote.com/v1"
        format :json
        headers 'Accept' => 'application/json'

        def initialize(app_id, app_token)
            self.class.basic_auth(app_id, app_token)
        end


        def beacons(options = {})
            response = self.class.get('/beacons', options)
            p response.response.code
            if response.response.code == "200"
                parsed_beacons = response.parsed_response
                estimote_beacons = parsed_beacons.map!{|config| Beacon.new(config)}
                return parsed_beacons
            elsif response.response.code == "403"
                raise EstimoteApi::Errors::Unauthorized, "invalid credentials"
            else
                []
            end
        end
    end
end
