class BeaconRegionEvent < Event

    def self.build_event(object, action, event_attributes)
        case action
        when "enter"
            return BeaconRegionEnterEvent.new(event_attributes)
        else
            return Event.new(event_attributes)
        end
    end


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

    def save
        if beacon_configuration
            add_to_event_attributes(
                {
                    configuration: {
                        id: beacon_configuration.id.to_s,
                        name: beacon_configuration.title,
                        tags: beacon_configuration.tags,
                        shared: beacon_configuration.shared
                    }.merge(beacon_configuration.configuration_attributes)
                }
            )
        end
        super
    end

    def beacon_configuration
        @beacon_configuration ||= case @protocol
        when BeaconConfiguration::IBEACON_PROTOCOL
            IBeaconConfiguration.find_by(uuid: @uuid, major: @major, minor: @minor)
        when BeaconConfiguration::EDDYSTONE_NAMESPACE_PROTOCOL
            EddystoneNamespaceConfiguration.find_by(namespace: @namespace, instance_id: @instance_id)
        when BeaconConfiguration::URL_PROTOCOL
            UrlConfiguration.find_by(url: @url)
        else
            nil
        end
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
