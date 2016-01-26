require 'httparty'
require 'lib/device'

class KontaktApi
    include HTTParty
    base_uri "https://api.kontakt.io"
    format :json
    headers 'Accept' => 'application/vnd.com.kontakt+json; version=7'

    def initialize(api_key)
        self.class.headers({'Api-key' => api_key})
    end


    def devices(options = {})
        options.merge!({query: {deviceType: "BEACON"}})
        response = self.class.get('/device', options)
        if response.response.code == "200"
            parsed_response = response.parsed_response["devices"]
            kontakt_beacons = parsed_response.map!{|config| Device.new(config)}
            return kontakt_beacons
        else
            return []
        end
    end
end
