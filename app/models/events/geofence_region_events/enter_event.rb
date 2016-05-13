module Events
    module GeofenceRegionEvents

        class EnterEvent < GeofenceRegionEvent

            after_save :track_customer_last_location_visit

            def self.event_id
                Events::Constants::GEOFENCE_REGION_ENTER_EVENT_ID
            end

            Events::Pipeline.register("geofence-region", "enter", self, { targetable: true })


            def track_customer_last_location_visit
                if location
                    current_time = Time.zone.now
                    update_params = {
                        "$inc" => {
                            "total_location_visits" => 1,
                        },
                        "$set" => {
                            "last_location_visit_id" => location.id,
                            "last_location_visit_at" => current_time
                        }
                    }
                    if customer.first_visit_at.nil?
                        update_params["$set"].merge!("first_visit_at" => current_time)
                    end
                    customer.update(update_params)
                end
            end
        end

    end
end
