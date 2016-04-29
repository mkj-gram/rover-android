module Events
    module GeofenceRegionEvents
        class GeofenceRegionEvent < Event

            before_save :save_messages_to_inbox

            attr_reader :geofence_region, :identifier_longitude, :longitude, :latitude, :radius

            def initialize(event_attributes)
                super
                @geofence_region = GeofenceRegion.new(event_attributes[:identifier])
                @latitude = event_attributes[:latitude]
                @longitude = event_attributes[:longitude]
                @radius = event_attributes[:radius]
            end


            def attributes
                parent_attributes = super

                if location
                    parent_attributes.merge!(
                        {
                            location: {
                                id: location.id,
                                title: location.title,
                                address: location.address,
                                postal_code: location.postal_code,
                                city: location.city,
                                province: location.province,
                                country: location.country,
                                latitude: location.latitude,
                                longitude: location.longitude,
                                tags: location.tags,
                                shared: location.shared
                            }
                        }
                    )
                end

                return parent_attributes
            end

            def to_json
                json = super
                # should have a location tied to it
                if location && location.enabled
                    json[:data][:attributes][:location] = {
                        name: location.title,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        radius: location.radius,
                        tags: location.tags,
                        shared: location.shared
                    }
                else
                    json[:data][:attributes][:location] = {}
                end

                return json
            end

            def message_opts
                @message_opts if @message_opts
                opts = super

                if location
                    opts.merge!(location.message_attributes.inject({}){|hash, (k,v)| hash.merge("location.#{k}" => v)})
                end

                @message_opts = opts
            end

            private

            def save_messages_to_inbox
                # TODO Refractor both beacon_region_event and location_event use the same structure
                puts "after save"
                @proximity_messages = get_message_for_location(location) || []
                if @proximity_messages && @proximity_messages.any?
                    deliver_messages(@proximity_messages)
                end
            end

            def get_message_for_location(location_configuration)
                messages = ProximityMessageTemplate.where(account_id: account.id, published: true,  trigger_event_id: self.class.event_id).where(today_schedule_column => true).where("? <@ date_schedule", generation_time_date).where("? <@ time_schedule", generation_time_minutes_since_midnight).all.to_a
                # apply all filters
                current_time = DateTime.now
                messages.select do |message|
                    message.within_schedule(current_time) && message.apply_configuration_filters(location_configuration) && message.within_customer_segment(customer, device)
                end
            end

            def location
                @location ||= -> {
                    if geofence_region && geofence_region.latitude && geofence_region.latitude
                        return Location.find_by(latitude: geofence_region.latitude , longitude: geofence_region.longitude)
                    else
                        return Location.find_by(latitude: latitude, longitude: longitude)
                    end
                }.call
            end
        end
    end
end
