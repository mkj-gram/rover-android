module Events
    class Event
        extend ActiveModel::Callbacks
        include ActiveModel::Validations

        define_model_callbacks :save, only: [:after, :before]


        TIME_REGEX = /^\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}/

        attr_reader :customer, :device, :object, :action, :generation_time, :source, :messages
        attr_accessor :raw_input

        def self.event_id
            Events::Constants::UNKNOWN_EVENT_ID
        end

        def initialize(event_attributes, extra)
            @id = SecureRandom.uuid
            event_attributes[:id] = @id
            @account = extra.delete(:account)
            @account_id = extra.delete(:account_id)
            @object = event_attributes[:object]
            @action = event_attributes[:action]
            @customer = extra.delete(:customer)
            @device = extra.delete(:device)
            @generation_time = get_time(event_attributes[:time])
            @errors = event_attributes.delete(:errors) || []
            @raw_input = event_attributes.to_json
            @included = []
            @messages = []
        end

        def attributes
            json = {
                event: {
                    id: self.class.event_id,
                    object: object,
                    action: action,
                    timestamp: generation_time.to_i,
                    source: source,
                    input: @raw_input,
                    errors: @errors
                },
                customer: {
                    id: customer.id,
                    identifier: customer.identifier,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    email: customer.email,
                    age: customer.age,
                    gender: customer.gender,
                    phone_number: customer.phone_number,
                    tags: customer.tags
                }
            }


            if device
                json.merge!(
                    device: {
                        id: device.id,
                        token: device.token,
                        locale_lang: device.locale_lang,
                        locale_region: device.locale_region,
                        time_zone: device.time_zone,
                        sdk_version: device.sdk_version,
                        platform: device.platform,
                        os_name: device.os_name,
                        os_version: device.os_version,
                        model: device.model,
                        manufacturer: device.manufacturer,
                        carrier: device.carrier,
                        app_identifier: device.app_identifier,
                        background_enabled: device.background_enabled,
                        notifications_enabled: device.notifications_enabled,
                        bluetooth_enabled: device.bluetooth_enabled,
                        location_monitoring_enabled: device.location_monitoring_enabled,
                        development: device.development,
                        aid: device.aid,
                        beacon_regions_monitoring: device.beacon_regions_monitoring.to_json,
                        geofence_regions_monitoring: device.geofence_regions_monitoring.to_json
                    }
                )

                if device.location
                    json[:device].merge!(
                        location: {
                            latitude: device.location.latitude,
                            longitude: device.location.longitude,
                            accuracy: device.location.accuracy,
                            timestamp: device.location.timestamp
                        }
                    )
                end
            end

            return json
        end

        def account
            @account ||= !@account_id.nil? ? Account.find(@account_id) : nil
        end

        def account_id
            @account_id ||= account ? account.id : nil
        end

        def save
            if self.class.event_id == Events::Constants::UNKNOWN_EVENT_ID
                Rails.logger.info("An event #{object}, #{action} was not recorded")
                return true
            end

            if should_process_event == false
                return true
            end
            # save works the opposite way than to_json
            # it bubbles up from the children appending their attributes
            run_callbacks :save do
                # TODO save this to somewhere
                EventsLogger.log(account_id, generation_time, attributes)
            end

            # Some event has updated the state of the customer so lets save the changes
            # Reindex if necessary 
            if customer.changes.any? || device.changes.any?
                customer.save
            end

            MetricsClient.aggregate("events.#{object}.#{action}" => { value: 1, source: "account_#{account_id}" })
        end

        def should_process_event
            return true
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
                MetricsClient.aggregate("#{template.metric_type}.delivered" => { value: 1, source: "account_#{account_id}" })
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
            # @included += inbox_messages_to_deliver.map{|message| V1::MessageSerializer.serialize(message)}
            # @included += local_messages_to_deliver.map{|message| V1::MessageSerializer.serialize(message)}

            # Quick fix add for now
            # TODO:
            # Remove this once google testing is done
            # move to state api
            if device.token
                messages = inbox_messages_to_deliver + local_messages_to_deliver
                SendMessageNotificationWorker.perform_async(customer, messages, [ device.id ])
            end

        end

        # TODO Fix this!

        def track_delivered_messages(messages)
            messages.each{ |message| track_delivered_message(message) }
        end

        def track_delivered_message(message)
            input = {
                object: "message",
                action: "added-to-inbox",
                message: message
               
            }.with_indifferent_access
            extras = {
                account: account,
                device: device,
                customer: customer
            }
            event = Events::Pipeline.build("message", "added-to-inbox", input, extras)
            event.raw_input = nil
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

        def closest_geofence_regions(limit = 20, query_all = true)
            query = {
                query: {
                    filtered: {
                        filter: {
                            bool: {
                                should: [
                                    {
                                        term: { account_id: account_id }
                                    },
                                    {
                                        term: { shared_account_ids: account_id }
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
                            distance_type: "plane",
                        }
                    }
                ]
            }

            if query_all == false
                query[:query][:filtered][:filter][:bool][:must].push(
                    {
                        geo_distance: {
                            distance: "10km",
                            optimize_bbox: "indexed",
                            distance_type: "sloppy_arc",
                            location: {
                                lat: latitude,
                                lon: longitude
                            }
                        }
                    }
                )
            end

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
