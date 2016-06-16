class V1::ScheduledMessageTemplateErrorSerializer < ModelError::Serializer
	attribute :scheduled_at, error_key: 'scheduled-at'
end