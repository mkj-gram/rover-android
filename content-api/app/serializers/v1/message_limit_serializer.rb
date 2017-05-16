module V1::MessageLimitSerializer
    class << self
        def serialize(limit)
            {
                "message-limit" => limit.message_limit,
                "number-of-minutes" => limit.number_of_minutes,
                "number-of-hours" => limit.number_of_hours,
                "number-of-days" => limit.number_of_days,
                "number-of-months" => limit.number_of_months
            }.compact
        end
    end
end
