module Events
    module GeofenceRegionEvents
        class GeofenceRegionEvent < Event

            before_save :save_messages_to_inbox

            attr_reader :geofence_region, :identifier_longitude, :longitude, :latitude, :radius

            def initialize(event_attributes, extra)
                super event_attributes, extra
                if event_attributes[:identifier]
                    @geofence_region = GeofenceRegion.new(event_attributes[:identifier])
                    @latitude = @geofence_region.latitude
                    @longitude = @geofence_region.longitude
                    @radius = @geofence_region.radius
                else
                    @latitude = event_attributes[:latitude]
                    @longitude = event_attributes[:longitude]
                    @radius = event_attributes[:radius]
                end
            end


            def attributes
                parent_attributes = super

                 if place
                    parent_attributes.merge!(
                        {
                            place: {
                                id: place.id,
                                title: place.title,
                                address: place.address,
                                city: place.city,
                                province: place.province,
                                country: place.country,
                                postal_code: place.postal_code,
                                latitude: place.latitude,
                                longitude: place.longitude,
                                tags: place.tags,
                                google_place_id: place.google_place_id,
                                enabled: place.enabled,
                                shared: place.shared,
                                beacon_configurations_count: place.beacon_configurations_count
                            }
                        }
                    )
                end
                
                return parent_attributes
            end

            def to_json
                json = super
                # should have a place tied to it
                if place && place.enabled
                    json[:data][:attributes][:place] = {
                        name: place.title,
                        latitude: place.latitude,
                        longitude: place.longitude,
                        radius: place.radius,
                        tags: place.tags,
                        shared: place.shared
                    }
                else
                    json[:data][:attributes][:place] = {}
                end

                return json
            end

            def message_opts
                @message_opts if @message_opts
                opts = super

                if place
                    opts.merge!(place.message_attributes.inject({}){|hash, (k,v)| hash.merge("place.#{k}" => v)})
                end

                @message_opts = opts
            end

            private

            def save_messages_to_inbox
                # TODO Refractor both beacon_region_event and place_event use the same structure
                @proximity_messages = get_message_for_place(place) || []
                if @proximity_messages && @proximity_messages.any?
                    deliver_messages(@proximity_messages)
                end
            end

            def get_message_for_place(place_configuration)
                messages = ProximityMessageTemplate.where(account_id: account.id, published: true,  trigger_event_id: self.class.event_id).where(today_schedule_column => true).where("? <@ date_schedule", generation_time_date).where("? <@ time_schedule", generation_time_minutes_since_midnight).all.to_a
                # apply all filters
                current_time = DateTime.now
                messages.select do |message|
                    message.within_schedule(current_time) && message.apply_configuration_filters(place_configuration) && message.within_customer_segment(customer, device)
                end
            end

            def place
                @place ||= -> {
                    if geofence_region && geofence_region.latitude && geofence_region.latitude
                        return [Place.find_by(latitude: geofence_region.latitude , longitude: geofence_region.longitude)]
                    else
                        return [Place.find_by(latitude: latitude, longitude: longitude)]
                    end
                }.call
                return @place.first
            end
        end
    end
end
