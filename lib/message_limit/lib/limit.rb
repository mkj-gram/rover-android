module MessageLimit
    class Limit
        attr_reader :message_limit, :number_of_days
        def initialize(opts)
            @message_limit = opts["message_limit"].to_i if opts.has_key?("message_limit")
            @number_of_days = opts["number_of_days"].to_i if opts.has_key?("number_of_days")
        end

        def limit
            message_limit
        end

        def dump
            {"message_limit" => message_limit, "number_of_days" => number_of_days}
        end

        def valid?
            !(message_limit.nil? && number_of_days.nil?)
        end

    end
end
