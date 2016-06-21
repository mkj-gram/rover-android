module Events
    class Event
        extend ActiveModel::Callbacks
        include ActiveModel::Validations

        define_model_callbacks :save, only: [:after, :before]


        TIME_REGEX = /^\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}/

        attr_reader :account, :customer, :device, :object, :action, :generation_time
        attr_reader :messages
        # attr_reader :inbox_messages, :local_messages # inbox_messages are messages that are persisted where local are one off messages

        def self.event_id
            Events::Constants::UNKNOWN_EVENT_ID
        end

        def initialize(event_attributes)
            @id = SecureRandom.uuid
            @account = event_attributes[:account]
            @object = event_attributes[:object]
            @action = event_attributes[:action]
            @customer = event_attributes[:customer]
            @device = event_attributes[:device]
            @generation_time = get_time(event_attributes[:time])
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
            if self.class.event_id == Events::Constants::UNKNOWN_EVENT_ID
                Rails.logger.info("An event #{object}, #{action} was not recorded")
                return true
            end
            # save works the opposite way than to_json
            # it bubbles up from the children appending their attributes
            run_callbacks :save do
                # TODO save this to somewhere
                puts "here are the attributes i'm going to save -> #{attributes}"
                EventsLogger.log(account.id, generation_time, attributes)
            end

            MetricsClient.aggregate("events.#{object}.#{action}" => { value: 1, source: "account_#{account.id}" })
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
            return @message_opts if @message_opts
            opts = {}

            if customer
                opts.merge!(customer.message_attributes.inject({}){|hash, (k,v)| hash.merge("customer.#{k}" => v)})
            end

            if device
                opts.merge!(device.message_attributes.inject({}){|hash, (k,v)| hash.merge("device.#{k}" => v)})
            end

            @message_opts = opts
        end


        def deliver_messages(message_templates)
            # messages is of type ::Messages
            # see if all pass rate limit
            # convert all to message instances
            # create each one
            # add them to the included array
            # track messages
            #
            message_templates.each do |template|
                MetricsClient.aggregate("#{template.metric_type}.delivered" => { value: 1, source: "account_#{account.id}" })
            end

            message_templates.each {|template| template.account = account }
            inbox_messages, local_messages = message_templates.partition(&:save_to_inbox)


            # first filter them
            inbox_messages_to_deliver = inbox_messages.select{|message| MessageRateLimit.add_message(message, customer, message.limits, account.message_limits)}
            local_messages_to_deliver = local_messages.select{|message| MessageRateLimit.add_message(message, customer, message.limits, account.message_limits)}


            # map them to inbox messages
            inbox_messages_to_deliver = inbox_messages_to_deliver.map{|message_template| message_template.render_message(customer, message_opts)}
            local_messages_to_deliver = local_messages_to_deliver.map{|message_template| message_template.render_message(customer, message_opts)}


            # save all the messages
            inbox_messages_to_deliver.each(&:save)
            local_messages_to_deliver.each(&:save)

            inbox_messages_to_deliver.each{|message| track_delivered_message(message)}
            local_messages_to_deliver.each{|message| track_delivered_message(message)}
            # add them to the included array for json output
            @included += inbox_messages_to_deliver.map{|message| V1::MessageSerializer.serialize(message)}
            @included += local_messages_to_deliver.map{|message| V1::MessageSerializer.serialize(message)}

            # Quick fix add for now
            # TODO:
            # Remove this once google testing is done
            # move to state api
            if device.remote_notifications_enabled
                message_ids = inbox_messages_to_deliver.map(&:id) + local_messages_to_deliver.map(&:id)
                SendMessageNotificationWorker.perform_async(customer.id, message_ids, [ device.id ])
            end

        end

        # TODO Fix this!

        def track_delivered_messages(messages)
            messages.each{ |message| track_delivered_message(message) }
        end

        def track_delivered_message(message)
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


            places = Elasticsearch::Model.search(query, [Place])
            places.per_page(limit).page(0).results.map do |document|
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
                Time.zone.now
            elsif time.is_a?(Integer)
                Time.zone.at(time)
            elsif time.is_a?(Float)
                Time.zone.at(time)
            else
                Time.zone.parse(time)
            end
        end
    end
end
