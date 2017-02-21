require_relative 'lib/client'

module XenioApi
    class << self

        def new(api_key)
            XenioApi::Client.new(api_key)
        end

    end
end
