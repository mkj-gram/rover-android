require 'auth/v1/auth_pb'
require 'auth/v1/auth_services_pb'

module Rover
  module Auth
    module V1
      module DefaultClient
        class << self
          def new
            return Auth::Stub.new("#{get_host}:#{get_port}", :this_channel_is_insecure)
          end

          private

          def get_host
            return ENV["AUTH_V1_SERVICE_HOST"] || '0.0.0.0'
          end

          def get_port
            return ENV["AUTH_V1_SERVICE_PORT"] || 5100
          end
        end
      end
    end
  end
end
