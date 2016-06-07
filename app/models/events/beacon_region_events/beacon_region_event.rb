module Events
    module BeaconRegionEvents
        class BeaconRegionEvent < Event

            after_save :track_customer_last_place_visit
            before_save :save_messages_to_inbox


            def initialize(event_attributes)
                super
                @configuration_id = event_attributes[:configuration_id]
                @uuid = event_attributes[:uuid]
                @major = event_attributes[:major_number]
                @minor = event_attributes[:minor_number]

                @eddystone_namespace = event_attributes[:namespace]
                @eddystone_instance_id = event_attributes[:instance_id]

                @url = event_attributes[:url]

                @protocol = if @uuid && @major && @minor
                    BeaconConfiguration::IBEACON_PROTOCOL
                elsif @eddystone_namespace && @eddystone_instance_id
                    BeaconConfiguration::EDDYSTONE_NAMESPACE_PROTOCOL
                elsif @url
                    BeaconConfiguration::URL_PROTOCOL
                else
                    BeaconConfiguration::NO_PROTOCOL
                end
                puts @uuid, @major, @minor
            end

            def attributes
                parent_attributes = super
                if beacon_configuration
                    parent_attributes.merge!(
                        {
                            configuration: {
                                id: beacon_configuration.id,
                                title: beacon_configuration.title,
                                protocol: beacon_configuration.protocol,
                                tags: beacon_configuration.tags,
                                shared: beacon_configuration.shared,
                                uuid: beacon_configuration.uuid,
                                major: beacon_configuration.major,
                                minor: beacon_configuration.minor,
                                namespace: beacon_configuration.namespace,
                                instance_id: beacon_configuration.instance_id,
                                url: beacon_configuration.url
                            }
                        }
                    )
                end

                if place
                    parent_attributes.merge!(
                        {
                            place: {
                                id: place.id,
                                title: place.title,
                                address: place.address,
                                postal_code: place.postal_code,
                                city: place.city,
                                province: place.province,
                                country: place.country,
                                latitude: place.latitude,
                                longitude: place.longitude,
                                tags: place.tags,
                                shared: place.shared
                            }
                        }
                    )
                end

                return parent_attributes
            end

            def to_json
                json = super
                if beacon_configuration && beacon_configuration.enabled
                    json[:data][:attributes][:configuration] = {
                        id: beacon_configuration.id,
                        name: beacon_configuration.title,
                        tags: beacon_configuration.tags,
                        shared: beacon_configuration.shared
                    }.merge(beacon_configuration.configuration_attributes)
                end

                if place && place.enabled
                    json[:data][:attributes][:place] = {
                        id: place.id,
                        name: place.title,
                        latitude: place.latitude,
                        longitude: place.longitude,
                        radius: place.radius,
                        tags: place.tags,
                        shared: place.shared
                    }
                end


                return json
            end

            def message_opts
                @message_opts if @message_opts
                opts = super

                if beacon_configuration
                    opts.merge!(beacon_configuration.message_attributes.inject({}){|hash, (k,v)| hash.merge("configuration.#{k}" => v)})
                end

                if place
                    opts.merge!(place.message_attributes.inject({}){|hash, (k,v)| hash.merge("place.#{k}" => v)})
                end

                @message_opts = opts
            end

            private

            def track_customer_last_place_visit
                if place && customer.last_place_visit_id != place.id
                    current_time = Time.zone.now
                    update_params = {
                        "$inc" => {
                            "total_place_visits" => 1,
                        },
                        "$set" => {
                            "last_place_visit_id" => place.id,
                            "last_place_visit_at" => current_time
                        }
                    }
                    if customer.first_visit_at.nil?
                        update_params["$set"].merge!("first_visit_at" => current_time)
                    end
                    customer.update(update_params)
                end
            end

            def save_messages_to_inbox
                puts "after save"
                @proximity_messages = get_messages_for_beacon_configuration(beacon_configuration) || []
                if @proximity_messages && @proximity_messages.any?
                    deliver_messages(@proximity_messages)
                end
            end

            def get_messages_for_beacon_configuration(beacon_configuration)
                return nil if beacon_configuration.nil?
                # has to perform all filtering in memory
                # first find all messages where the trigger_event_id is the type of event which occured
                message_templates = ProximityMessageTemplate.where(account_id: account.id, published: true,  trigger_event_id: self.class.event_id).where(today_schedule_column => true).where("? <@ date_schedule", generation_time_date).where("? <@ time_schedule", generation_time_minutes_since_midnight).all.to_a
                # apply all filters
                current_time = DateTime.now
                message_templates.select do |message_template|
                    message_template.within_schedule(current_time) && message_template.apply_configuration_filters(beacon_configuration) && message_template.within_customer_segment(customer, device)
                end
            end

            def beacon_configuration
                # we use empty arrays so that we know the value has been initialized
                # if we returned nil the function would rerun and not keep the cached result
                @beacon_configuration ||=
                case @protocol
                when BeaconConfiguration::IBEACON_PROTOCOL
                    configuration = IBeaconConfiguration.find_by(account_id: account.id, uuid: @uuid, major: @major, minor: @minor)
                    if configuration && configuration.enabled
                        [configuration]
                    else
                        []
                    end
                when BeaconConfiguration::EDDYSTONE_NAMESPACE_PROTOCOL
                    configuration = EddystoneNamespaceConfiguration.find_by(account_id: account.id, namespace: @namespace, instance_id: @instance_id)
                    if configuration && configuration.enabled
                        [configuration]
                    else
                        []
                    end
                when BeaconConfiguration::URL_PROTOCOL
                    configuration = UrlConfiguration.find_by(account_id: account.id, url: @url)
                    if configuration && configuration.enabled
                        [configuration]
                    else
                        []
                    end
                else
                    if @configuration_id
                        configuration = BeaconConfiguration.find_by_id(@configuration_id)
                        if configuration && configuration.enabled
                            [configuration]
                        else
                            []
                        end
                    else
                        []
                    end
                end
                return @beacon_configuration.first
            end

            def place
                @place ||= beacon_configuration.nil? ? nil : beacon_configuration.place
            end

            def serialize_beacon_configuration(beacon_configuration)
                {
                    "id" => beacon_configuration.id.to_s,
                    "name" => beacon_configuration.title,
                    "tags" => beacon_configuration.tags,
                    "shared" => beacon_configuration.shared,
                    "enabled" => beacon_configuration.enabled
                }.merge(beacon_configuration.configuration_attributes)
            end

        end
    end
end
