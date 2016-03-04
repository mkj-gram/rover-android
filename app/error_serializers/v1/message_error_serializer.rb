class V1::MessageErrorSerializer < ModelError::Serializer


    attribute :schedule_start_date, error_key: :"schedule-start-date"
    attribute :schedule_end_date, error_key: :"schedule-end-date"
    attribute :schedule_start_time, error_key: :"schedule-start-time"
    attribute :schedule_end_time, error_key: :"schedule-end-time"

end
