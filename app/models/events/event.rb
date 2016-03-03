class Event
    extend ActiveModel::Callbacks
    include ActiveModel::Validations

    define_model_callbacks :save, only: [:after, :before]

    UNKNOWN_EVENT_ID = 0

    # each get a block of 20
    # Geofence Region Event 1-20
    GEOFENCE_REGION_EVENT_ID = 1
    GEOFENCE_REGION_ENTER_EVENT_ID = 2
    GEOFENCE_REGION_EXIT_EVENT_ID = 3

    # Beacon Region Event 21-40
    BEACON_REGION_EVENT_ID = 21
    BEACON_REGION_ENTER_EVENT_ID = 22
    BEACON_REGION_EXIT_EVENT_ID = 23

    # App Events 41-60
    APP_EVENT_ID = 41
    APP_OPEN_EVENT_ID = 42
    APP_CLOSED_EVENT_ID = 43

    # Location Events 61-80
    LOCATION_EVENT_ID = 61
    LOCATION_UPDATE_EVENT_ID = 62

    VALID_EVENT_IDS = Set.new([GEOFENCE_REGION_ENTER_EVENT_ID, GEOFENCE_REGION_EXIT_EVENT_ID, BEACON_REGION_ENTER_EVENT_ID, BEACON_REGION_EXIT_EVENT_ID, APP_OPEN_EVENT_ID, APP_CLOSED_EVENT_ID])

    def self.valid_event_id(event_id)
        VALID_EVENT_IDS.include?(event_id)
    end

    def self.event_string_to_event_id(event_string)
        case event_string
        when "geofence-region-enter"
            GEOFENCE_REGION_ENTER_EVENT_ID
        when "geofence-region-exit"
            GEOFENCE_REGION_EXIT_EVENT_ID
        when "beacon-region-enter"
            BEACON_REGION_ENTER_EVENT_ID
        when "beacon-region-exit"
            BEACON_REGION_EXIT_EVENT_ID
        when "app-open"
            APP_OPEN_EVENT_ID
        when "app-close"
            APP_CLOSED_EVENT_ID
        else
            UNKNOWN_EVENT_ID
        end
    end

    def self.event_id_to_event_string(event_id)
        case event_id
        when GEOFENCE_REGION_ENTER_EVENT_ID
            "geofence-region-enter"
        when GEOFENCE_REGION_EXIT_EVENT_ID
            "geofence-region-exit"
        when BEACON_REGION_ENTER_EVENT_ID
            "beacon-region-enter"
        when BEACON_REGION_EXIT_EVENT_ID
            "beacon-region-exit"
        when APP_OPEN_EVENT_ID
            "app-open"
        when APP_CLOSED_EVENT_ID
            "app-close"
        else
            nil
        end
    end

    def self.build_event(event_attributes)
        object = event_attributes[:object]
        action = event_attributes[:action]
        case object
        when "location"
            return LocationEvent.build_event(object, action, event_attributes)
        when "beacon-region"
            return BeaconRegionEvent.build_event(object, action, event_attributes)
        when "geofence-region"
            return GeofenceRegionEvent.build_event(object, action, event_attributes)
        when "app"
            return AppEvent.build_event(object, action, event_attributes)
        else
            return Event.new(event_attributes)
        end

    end


    attr_reader :account, :customer, :device, :object, :action, :generation_time
    attr_reader :new_messages
    # attr_reader :inbox_messages, :local_messages # inbox_messages are messages that are persisted where local are one off messages

    def initialize(event_attributes)
        @id = SecureRandom.uuid
        @account = event_attributes[:account]
        @object = event_attributes[:object]
        @action = event_attributes[:action]
        @customer = event_attributes[:customer]
        @device = event_attributes[:device]
        # this needs to be the customers time
        @generation_time = Time.now
        @included = []
        @attributes = {object: @object, action: @action}
        @new_messages = []
    end

    def attributes
        {"id" => @id, "object" => object, "action" => action}
    end


    def save
        # save works the opposite way than to_json
        # it bubbles up from the children appending their attributes
    end

    def today_schedule_column
        "schedule_#{Date::DAYNAMES[generation_time.wday].downcase}"
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
                id: rand(99999),
                attributes: {
                    object: object,
                    action: action
                }
            },
            included: []
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

end
