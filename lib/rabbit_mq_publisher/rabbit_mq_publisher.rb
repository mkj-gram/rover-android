require 'lib/connection_pool'
# A Wrapper class around Sneakers Publisher with a connection pool
# it uses the same config as Sneakers
#
# @author [chrisrecalis]
#
module RabbitMQPublisher

    class << self

        @@publisher = RabbitMQPublisher::ConnectionPool.new

        def publish(msg, options = {})
            @@publisher.publish(msg, options)
        end

        def pub
            return @@publisher
        end

    end
end
