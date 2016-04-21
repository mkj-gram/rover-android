module Events
    module BeaconRegionEvents
        class BeaconRegionEvent < Event

            before_save :save_messages_to_inbox


            def initialize(event_attributes)
                super
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

            end

            def attributes
                parent_attributes = super
                if beacon_configuration
                    parent_attributes.merge!(
                        {
                            configuration: {
                                id: beacon_configuration.id,
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

                if location
                    parent_attributes.merge!(
                        {
                            location: {
                                id: location.id,
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
                if beacon_configuration && beacon_configuration.enabled
                    json[:data][:attributes][:configuration] = {
                        id: beacon_configuration.id,
                        name: beacon_configuration.title,
                        tags: beacon_configuration.tags,
                        shared: beacon_configuration.shared
                    }.merge(beacon_configuration.configuration_attributes)
                end

                if location && location.enabled
                    json[:data][:attributes][:location] = {
                        id: location.id,
                        name: location.title,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        radius: location.radius,
                        tags: location.tags,
                        shared: location.shared
                    }
                end


                return json
            end


            private

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
                    []
                end
                return @beacon_configuration.first
            end

            def location
                @location ||= beacon_configuration.nil? ? nil : beacon_configuration.location
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
