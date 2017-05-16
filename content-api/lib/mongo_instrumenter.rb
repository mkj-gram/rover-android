module MongoInstrumenter
    class Monitoring

        attr_reader :options

        LOG_STRING_LIMIT = 250

        def initialize(options = {})
            @options = options
        end

        def started(event)

        end

        def succeeded(event)
            MetricsClient.aggregate("mongodb.command.#{event.command_name}" => 1)
            MetricsClient.aggregate("mongodb.command.#{event.command_name}.duration" => event.duration * 1000)
        end

        def failed(event)
            MetricsClient.aggregate("mongodb.command.#{event.command_name}.failed" => 1)
        end
    end

end
