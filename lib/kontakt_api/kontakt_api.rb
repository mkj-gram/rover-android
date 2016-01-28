require_relative 'lib/client'
require_relative 'lib/device'
require_relative 'lib/errors'

module KontaktApi
    class << self

        def new(api_key)
            KontaktApi::Client.new(api_key)
        end

    end
end
