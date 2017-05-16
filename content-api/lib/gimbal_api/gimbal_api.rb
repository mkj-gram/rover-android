require 'gimbal_api/client'

module GimbalApi
    class << self

        def new(api_key)
            GimbalApi::Client.new(api_key)
        end

    end
end
