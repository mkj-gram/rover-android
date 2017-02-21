require_relative 'zone'
require_relative 'place'
require_relative 'request_error'

module XenioApi
    class Client
        include HTTParty

        base_uri "https://jvh69qvt73.execute-api.us-west-2.amazonaws.com/roverdev"
        format :json
        headers 'Accept' => 'application/json'
        headers 'User-Agent' => "Rover-Sync"

        CUSTOMER_ID = "9A065B55-E43B-446C-A144-9A2045AFF85B"

        def initialize(api_key)
            @headers = {'X-Api-Key' => api_key}
        end

        def zones
            raw_response = make_request("GET", "/zones")

            status_code = raw_response.response.code.to_i
            if !(status_code >= 200 && status_code < 400)
                raise XenioApi::RequestError, raw_response.body
            end

            response = raw_response.parsed_response

            if !response.include?("zones")
                return []
            end

            return response["zones"].map{|zone_config| XenioApi::Zone.new(zone_config) }
        end

        def places
            raw_response = make_request("GET", "/places")

            status_code = raw_response.response.code.to_i
            if !(status_code >= 200 && status_code < 400)
                raise XenioApi::RequestError, raw_response.body
            end
            
            response = raw_response.parsed_response

            if !response.include?("places")
                return []
            end

            return response["places"].map{ |place_config| XenioApi::Place.new(place_config) }
        end

        private

        def make_request(type, endpoint, opts = {})

            opts = {} if opts.nil?
            # /CUSTOMERID/ZONES
            # /CUSTOMERID/PLACES
            endpoint = File.join("/", CUSTOMER_ID , endpoint)

            case type
            when "POST"
                return self.class.post(endpoint, query: opts[:query], headers: @headers)
            else
                return self.class.get(endpoint, query: opts[:query], headers: @headers)
            end
        end
    end
end