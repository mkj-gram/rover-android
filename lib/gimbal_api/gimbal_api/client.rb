module GimbalApi
    class Client
        include HTTParty
        base_uri "https://manager.gimbal.com/api/v2/"
        format :json
        headers 'Accept' => 'application/json'

        def initialize(api_key)
            self.class.headers({'Authorization' => "Token #{api_key}"})
        end

        def places(include_headers = false, opts = {})
            response = self.class.get('/places', query: opts)
            if response.response.code == "200"
                places = response.parsed_response.map do |opts|
                    opts = opts.merge({"client" => self, "loaded" => false})
                    GimbalApi::Place.new(opts)
                end
            elsif response.response.code == "401"
                raise GimbalApi::Errors::Unauthorized, "invalid credentials"
            else
                places = []
            end

            if include_headers
                return {
                    places: places,
                    headers: response.headers
                }
            end

            return places
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
