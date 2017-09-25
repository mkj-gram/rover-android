require 'audience/v1/audience_pb'
require 'audience/v1/audience_services_pb'

module Rover
  module Audience
    module V1
      module DefaultClient
        class << self
          def new
            return Audience::Stub.new("#{get_host}:#{get_port}", :this_channel_is_insecure)
          end

          private

          def get_host
            return ENV["AUDIENCE_V1_SERVICE_HOST"] || ENV["AUDIENCE_SERVICE_HOST"] || '0.0.0.0'
          end

          def get_port
            return ENV["AUDIENCE_V1_SERVICE_PORT"] || ENV["AUDIENCE_SERVICE_PORT"] || 5100
          end
        end
      end
    end
  end
end
