module MessageLimit
    class Limit
        attr_reader :message_limit, :number_of_minutes, :number_of_hours, :number_of_days, :number_of_months
        def initialize(opts)
            opts = opts.with_indifferent_access
            @message_limit = opts["message_limit"].to_i if opts.has_key?("message_limit")
            @number_of_months = opts["number_of_months"].to_i if opts.has_key?("number_of_months")
            @number_of_days = opts["number_of_days"].to_i if opts.has_key?("number_of_days")
            @number_of_hours = opts["number_of_hours"].to_i if opts.has_key?("number_of_hours")

            if @number_of_months
                @number_of_minutes = @number_of_months * 30 * 24 * 60
            elsif @number_of_days
                @number_of_minutes = @number_of_days * 24 * 60
            elsif @number_of_hours
                @number_of_minutes = @number_of_hours * 60
            else
                @number_of_minutes = opts["number_of_minutes"].to_i
            end
        end

        def limit
            message_limit
        end

        def dump
            if @number_of_hours
                {"message_limit" => message_limit, "number_of_hours" => number_of_hours}
            elsif @number_of_days
                {"message_limit" => message_limit, "number_of_days" => number_of_days}
            else
                {"message_limit" => message_limit, "number_of_minutes" => number_of_minutes}
            end
        end

        def number_of_seconds
            @number_of_minutes * 60
        end

        def valid?
            !(message_limit.nil? && number_of_minutes.nil?)
        end

        def ==(other)
            self.message_limit == other.message_limit && self.number_of_minutes == other.number_of_minutes
        end

        def eql?(other)
            return self == other
        end
    end
end
