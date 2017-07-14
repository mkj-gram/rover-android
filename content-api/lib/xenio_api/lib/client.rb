require_relative 'zone'
require_relative 'place'
require_relative 'request_error'

module XenioApi
    class Client
        include HTTParty

        base_uri Rails.configuration.xenio["api_base_uri"]
        format :json
        headers 'Accept' => 'application/json'
        headers 'User-Agent' => "Rover-Sync"
        headers 'X-Api-Key' => Rails.configuration.xenio["api_token"]

        def initialize(customer_id)
            @customer_id = customer_id
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
            endpoint = File.join("/", @customer_id , endpoint)

            case type
            when "POST"
                return self.class.post(endpoint, query: opts[:query])
            else
                return self.class.get(endpoint, query: opts[:query])
            end
        end
    end
end