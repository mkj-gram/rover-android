require_relative 'lib/client'

module XenioApi
    class << self

        def new(customer_id)
            XenioApi::Client.new(customer_id)
        end

    end
end
