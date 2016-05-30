class V1::ProximityMessageTemplateErrorSerializer < V1::MessageTemplateErrorSerializer
    attribute :trigger_event_id, error_key: :trigger_event
end
