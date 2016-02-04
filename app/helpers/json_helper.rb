module JsonHelper

    def validate_json_schema
        return true if @valid_json == true
        begin
            data = params[:data]
            if data.is_a?(Hash)
                data = [data]
            end

            ClassyHash.validate_strict({data: data}, request_schema)

            data.each do |d|
                # fix rails...
                d[:attributes] = {} if !d.has_key?(:attributes)
            end
            @valid_json = true
        rescue RuntimeError => e
            @valid_json = false
            render_errors([{
                             title: "Validation Error",
                             description: "The request was malformed: #{e}",
                             status: "400"
            }], {status: :bad_request})
        end
    end

    def flatten_request(opts = {})
        # loop through data flattening everything
        # {
        #   "data": {
        #     "type": "photos",
        #     "attributes": {
        #       "title": "Ember Hamster",
        #       "src": "http://example.com/images/productivity.png"
        #     },
        #     "relationships": {
        #       "photographer": {
        #         "data": { "type": "people", "id": "9" }
        #       }
        #     }
        #   }
        # }
        # First validate the request

        single_record = option(opts, :single_record, false)
        data = params.delete(:data)

        if data.is_a?(Hash)
            data = [data]
        end

        validate_json_schema

        data.map!{|sub_data| {sub_data[:type] => {id: sub_data[:id]}.merge!(sub_data[:attributes]).merge!({relationships: sub_data[:relationships]})}}
        if single_record
            return params.merge!({:data => data.first})
        else
            return params.merge!({:data => data})
        end
    end



    def request_schema
        # we cache the schema for all requests
        # @@request_schema ||=
        # Rails.logger.debug("Initializing json_api schema")
        each_schema = {
            type: String,
            id: [:optional, String, Integer],
            attributes: [:optional, Hash]
        }

        {
            data: [[each_schema]]
        }

    end

    def option(options, key, default)
        result = options.delete(key)
        result = result.nil? ? default : result
        return result
    end
end
