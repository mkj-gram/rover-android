class BeaconRegionEvent < Event

    after_save :save_messages_to_inbox

    # def self.event_id
    #     Event::BEACON_REGION_EVENT_ID
    # end

    def self.build_event(object, action, event_attributes)
        case action
        when "enter"
            return BeaconRegionEnterEvent.new(event_attributes)
        when "exit"
            return BeaconRegionExitEvent.new(event_attributes)
        else
            return Event.new(event_attributes)
        end
    end


    def initialize(event_attributes)
        super
        @uuid = event_attributes[:uuid].upcase
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
            parent_attributes.merge(
                {
                    configuration: {
                        id: beacon_configuration.id,
                        title: beacon_configuration.title,
                        tags: beacon_configuration.tags,
                        shared: beacon_configuration.shared,
                        enabled: beacon_configuration.enabled
                    }
                }
            )
        else
            return parent_attributes
        end
    end

    def to_json
        json = super
        if beacon_configuration && beacon_configuration.enabled
            json[:data][:attributes][:configuration] = {
                name: beacon_configuration.title,
                tags: beacon_configuration.tags,
                shared: beacon_configuration.shared
            }.merge(beacon_configuration.configuration_attributes)
            # only include the message if the configuration exists

            if new_messages.any?
                Rails.logger.info("Detected #{new_messages.size} to be rendered out")
                json[:included] += new_messages.map{|message| V1::InboxMessageSerializer.serialize(message)}
            end
        else
            json[:data][:attributes][:configuration] = {}
        end
        return json
    end


    private

    def save_messages_to_inbox
        puts "after save"
        @proximity_messages = get_messages_for_beacon_configuration(beacon_configuration) || []
        if @proximity_messages && @proximity_messages.any?
            # @inbox_messages = @proximity_messages.select{|message| message.save_to_inbox}.map{|message| message.to_inbox_message(message_opts)}
            # @local_messages = @proximity_messages.select{|message| message.save_to_inbox == false}
            messages_to_deliver = @proximity_messages.map{|message| message.to_inbox_message(message_opts)}

            @new_messages = customer.inbox.add_messages(messages_to_deliver, account) if messages_to_deliver.any?
        end
    end

    def get_messages_for_beacon_configuration(beacon_configuration)
        return nil if beacon_configuration.nil? || !beacon_configuration.enabled
        # has to perform all filtering in memory
        # first find all messages where the trigger_event_id is the type of event which occured
        messages = ProximityMessage.where(account_id: account.id, published: true,  trigger_event_id: self.class.event_id).where(today_schedule_column => true).where("? <@ date_schedule", generation_time_date).where("? <@ time_schedule", generation_time_minutes_since_midnight).all.to_a
        # apply all filters
        current_time = DateTime.now
        messages.select do |message|
            message.within_schedule(current_time) && message.apply_configuration_filters(beacon_configuration) && message.apply_customer_filters(customer, device)
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
