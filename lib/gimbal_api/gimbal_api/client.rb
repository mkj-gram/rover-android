module GimbalApi
    class Client
        include HTTParty
        base_uri "https://manager.gimbal.com/api/v2/"
        format :json
        headers 'Accept' => 'application/json'

        def initialize(api_key)
            self.class.headers({'Authorization' => "Token #{api_key}"})
        end

        def places
            response = self.class.get('/places', {})
            if response.response.code == "200"
                places = response.parsed_response.map do |opts|
                    opts = opts.merge({"client" => self, "loaded" => false})
                    GimbalApi::Place.new(opts)
                end
                return places
            elsif response.response.code == "401"
                return []
            else
                return []
            end
        end

        def place(place_id)
            response = self.class.get("/places/#{place_id}")
            if response.response.code == "200"
                opts = response.parsed_response.merge({"client" => self, "loaded" => true})
                place = GimbalApi::Place.new(opts)
                return place
            else
                return nil
            end
        end

    end
end
