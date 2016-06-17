class V1::ScheduledMessageTemplateErrorSerializer < ModelError::Serializer
	attribute :scheduled_at, error_key: 'scheduled-timestamp'
	attribute :scheduled_time_zone, error_key: 'scheduled-time-zone'
end