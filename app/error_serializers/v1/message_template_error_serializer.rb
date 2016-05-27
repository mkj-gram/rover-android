class V1::MessageTemplateErrorSerializer < ModelError::Serializer

    attribute :title, error_key: :name
    attribute :schedule_start_date, error_key: :"schedule-start-date"
    attribute :schedule_end_date, error_key: :"schedule-end-date"
    attribute :schedule_start_time, error_key: :"schedule-start-time"
    attribute :schedule_end_time, error_key: :"schedule-end-time"
    attribute :action
    attribute :properties
end
