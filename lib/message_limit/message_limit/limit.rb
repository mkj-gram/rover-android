module MessageLimit
    class Limit
        attr_reader :message_limit, :number_of_minutes
        def initialize(opts)
            opts = opts.with_indifferent_access
            @message_limit = opts["message_limit"].to_i if opts.has_key?("message_limit")

            @number_of_minutes = opts["number_of_days"].to_i * 24 * 60 if opts.has_key?("number_of_days")
            @number_of_minutes = opts["number_of_minutes"].to_i if opts.has_key?("number_of_minutes")

        end

        def limit
            message_limit
        end

        def dump
            {"message_limit" => message_limit, "number_of_minutes" => number_of_minutes}
        end

        def valid?
            !(message_limit.nil? && number_of_minutes.nil?)
        end

    end
end
