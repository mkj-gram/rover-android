class GeofenceRegionExitEvent < GeofenceRegionEvent

    def self.event_id
        Event::GEOFENCE_REGION_EXIT_EVENT_ID
    end

    def save

        super
    end

    def to_json
        json = super

        return json
    end


end
