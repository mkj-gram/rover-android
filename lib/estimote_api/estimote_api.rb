require_relative 'lib/client'
require_relative 'lib/beacon'
require_relative 'lib/errors'

module EstimoteApi
    class << self
        def new(app_id, app_token)
            EstimoteApi::Client.new(app_id, app_token)
        end
    end
end
