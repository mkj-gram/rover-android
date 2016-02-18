class GeofenceRegionEnterEvent < GeofenceRegionEvent

    def self.event_id
        Event::GEOFENCE_REGION_ENTER_EVENT_ID
    end

    def save

        super
    end

    def to_json
        json = super

        return json
    end


end
