require 'httparty'

class KontaktApi
    include HTTParty
    base_uri "https://api.kontakt.io"
    format :json
    headers 'Accept' => 'application/vnd.com.kontakt+json; version=6'

    def initialize(api_key)
        self.headers({'Api-key' => api_key})
    end


    def devices(options = {})

        response = self.class.get('/device', options)
        if response.response.code == "200"
            parsed_response = response.parsed_response
            return parsed_response
        else
            return []
        end
    end
end
