require 'httparty'
require 'lib/client'
require 'lib/beacon'
require 'lib/errors'

module EstimoteApi
    class << self
        def new(app_id, app_token)
            EstimoteApi::Client.new(app_id, app_token)
        end
    end
end
