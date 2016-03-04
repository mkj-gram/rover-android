class V1::ProximityMessageErrorSerializer < V1::MessageErrorSerializer
    attribute :trigger_event_id, error_key: :trigger_event
end
