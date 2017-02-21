require_relative 'lib/client'

module XenioApi
    class << self

        def new(api_key, customer_id)
            XenioApi::Client.new(api_key, customer_id)
        end

    end
end
