require 'httparty'
require 'lib/beacon'

class EstimoteApi
    include HTTParty
    base_uri "https://cloud.estimote.com/v1"
    format :json
    headers 'Accept' => 'application/json'

    def initialize(app_id, app_token)
        @auth = {username: app_id, password: app_token}
    end


    def beacons(options = {})
        options.merge!({ basic_auth: @auth })
        response = self.class.get('/beacons', options)
        if response.response.code == "200"
            parsed_beacons = response.parsed_response
            estimote_beacons = parsed_beacons.map!{|config| Beacon.new(config)}
            return parsed_beacons
        else
            return []
        end
    end
end
