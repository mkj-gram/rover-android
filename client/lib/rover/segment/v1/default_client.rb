require 'rover/segment/v1/segment_services_pb'

module Rover
    module Segment
        module V1
            module DefaultClient
                class << self
                    def new
                        return Segment::Stub.new("#{get_host}:#{get_port}", :this_channel_is_insecure)
                    end

                    private
                    
                    def get_host
                        return ENV["SEGMENT_V1_SERVICE_HOST"] || '0.0.0.0'
                    end

                    def get_port
                        return ENV["SEGMENT_V1_SERVICE_PORT"] || 5100
                    end
                end
            end
        end
    end
end