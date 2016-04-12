module Events
    class Event
        extend ActiveModel::Callbacks
        include ActiveModel::Validations

        define_model_callbacks :save, only: [:after, :before]


        TIME_REGEX = /^\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}/

        attr_reader :account, :customer, :device, :object, :action, :generation_time
        attr_reader :messages
        # attr_reader :inbox_messages, :local_messages # inbox_messages are messages that are persisted where local are one off messages

        def initialize(event_attributes)
            @id = SecureRandom.uuid
            @account = event_attributes[:account]
            @object = event_attributes[:object]
            @action = event_attributes[:action]
            @customer = event_attributes[:customer]
            @device = event_attributes[:device]
            @generation_time = get_time(event_attributes[:time])
            Rails.logger.debug("Customers time is #{@generation_time}")
            @included = []
            @messages = []
        end

        def attributes
            {
                event: {
                    id: self.class.event_id,
                    object: object,
                    action: action,
                    timestamp: generation_time.to_i
                },
                customer: {
                    id: customer.id.to_s,
                    identifier: customer.identifier,
                    gender: customer.gender,
                    age: customer.age,
                    tags: customer.tags,
                    location: {
                        latitude: customer.location ? customer.location.latitude : nil,
                        longitude: customer.location ? customer.location.longitude : nil
                    }
                },
                device: {
                    id: device.id.to_s,
                    locale_lang: device.locale_lang,
                    locale_region: device.locale_region,
                    sdk_version: device.sdk_version,
                    time_zone: device.time_zone,
                    platform: device.platform,
                    os_name: device.os_name,
                    os_version: device.os_version,
                    model: device.model,
                    manufacturer: device.manufacturer,
                    background_enabled: device.background_enabled,
                    local_notifications_enabled: device.local_notifications_enabled,
                    remote_notifications_enabled: device.remote_notifications_enabled,
                    bluetooth_enabled: device.bluetooth_enabled,
                    location_monitoring_enabled: device.location_monitoring_enabled
                }
            }
        end


        def save
            # save works the opposite way than to_json
            # it bubbles up from the children appending their attributes
            run_callbacks :save do
                # TODO save this to somewhere
                puts "here are the attributes i'm going to save -> #{attributes}"
                EventsLogger.log(account.id, generation_time, attributes)
            end

        end

        def today_schedule_column
            "schedule_#{Date::DAYNAMES[generation_time.wday].downcase}"
        end

        def generation_time_date
            @generation_time_date ||= self.generation_time.beginning_of_day.to_i
        end

        def generation_time_minutes_since_midnight
            @generation_time_minutes_since_midnight ||= (self.generation_time.seconds_since_midnight.to_i / 60)
        end


        def message_opts
            @message_opts ||= -> {
                opts = {}
                if customer
                    opts.merge!(customer.attributes.inject({}){ |hash, (k,v)| hash.merge("customer.#{k}" => v)})
                end

                if device
                    opts.merge!(device.attributes.inject({}){|hash, (k,v)| hash.merge("device.#{k}" => v)})
                end

                return opts
            }.call
        end

        def deliver_messages(messages)
            inbox_messages, local_messages = messages.partition(&:save_to_inbox)

            # first filter them
            inbox_messages_to_deliver = inbox_messages.select{|message| MessageRateLimit.add_message(message, customer, message.limits, account.message_limits)}
            local_messages_to_deliver = local_messages.select{|message| MessageRateLimit.add_message(message, customer, message.limits, account.message_limits)}

            # map them to inbox messages
            inbox_messages_to_deliver = inbox_messages_to_deliver.map{|message| message.to_inbox_message(message_opts)}
            local_messages_to_deliver = local_messages_to_deliver.map{|message| message.to_inbox_message(message_opts)}

            # add them to the included array for json output
            @included += inbox_messages_to_deliver.map{|message| V1::InboxMessageSerializer.serialize(message)}
            @included += local_messages_to_deliver.map{|message| V1::InboxMessageSerializer.serialize(message)}
            # track them in the analytics
            track_delivered_messages(inbox_messages_to_deliver)
            track_delivered_messages(local_messages_to_deliver)

        end

        def track_delivered_messages(messages)
            messages.each{ |message| track_delivered_message(message) }
        end

        def track_delivered_message(message)
            message = message.is_a?(InboxMessage) ? message.message : message
            attributes = {
                object: "message",
                action: "delivered",
                message: message,
                account: account,
                device: device,
                customer: customer
            }.with_indifferent_access

            event = Events::Pipeline.build("message", "delivered", attributes)
            event.save
        end

        # want a way to say add this to the saved model
        # then dump everything in mongo
        #

        def add_to_included(object)
            if object.is_a?(Hash)
                @included.push(object)
            elsif object.is_a?(Array)
                @included += object
            end
        end

        # used for adding extra attributes to be saved along with the event
        def add_to_event_attributes(object)
        end

        def to_json
            json = {
                data: {
                    type: "events",
                    id: @id,
                    attributes: {
                        object: object,
                        action: action
                    }
                },
                included: @included
            }
            return json
        end

        def get_customers_inbox
            @customer_inbox ||= CustomerInbox.find(customer.id)
        end

        def closest_geofence_regions(limit = 20)
            query = {
                query: {
                    filtered: {
                        filter: {
                            bool: {
                                should: [
                                    {
                                        term: { account_id: account.id }
                                    },
                                    {
                                        term: { shared_account_ids: account.id }
                                    }
                                ],
                                must: [
                                    {
                                        term: { enabled: true }
                                    }
                                ]
                            }
                        }
                    }
                },
                sort:  [
                    {
                        :"_geo_distance" => {
                            location: {
                                lat: latitude,
                                lon: longitude
                            },
                            order: "asc",
                            unit: "km",
                            :"distance_type" => "plane"
                        }
                    }
                ]
            }


            locations = Elasticsearch::Model.search(query, [Location])
            locations.per_page(limit).page(0).results.map do |document|
                latitude = document._source.location.lat
                longitude = document._source.location.lon
                radius = document._source.radius
                GeofenceRegion.new(latitude: latitude, longitude: longitude, radius: radius)
            end

        end

        def ibeacon_wildcard_regions
            @ibeacon_wildcard_regions ||= -> {
                if device.ios?
                    account.ibeacon_configuration_uuids.configuration_uuids.map{|uuid| IBeaconRegion.new(uuid: uuid)}
                else
                    []
                end
            }.call
        end

        private

        def get_time(time)
            if time.nil?
                Time.now
            elsif time.is_a?(Integer)
                Time.at(time)
            elsif time.is_a?(Float)
                Time.at(time)
            else
                # remove the timezone
                matches = TIME_REGEX.match(time)
                if matches.size == 1
                    Time.parse(matches[0])
                else
                    Time.now
                end
            end
        end
    end
end
