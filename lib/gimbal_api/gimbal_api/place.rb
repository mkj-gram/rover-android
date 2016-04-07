module GimbalApi
    class Place

        attr_reader :id, :name, :attributes, :geofence, :beacons, :arrival_rssi, :departure_rssi

        def initialize(opts = {})
            @client = opts["client"]
            @id = opts["id"]
            @name = opts["name"]
            @attributes = opts["attributes"]

            if opts["geofence"]
                @geofence = GimbalApi::Geofence.new(opts["geofence"])
            end

            if opts["beacons"]
                @beacons = opts["beacons"].map{|beacon_opts| GimbalApi::Beacon.new(beacon_opts)}
            end

            @arrival_rssi = opts["arrivalRssi"]
            @departure_rssi = opts["departureRssi"]
            @loaded = opts["loaded"] || false
        end

        def attributes
            load_details!
            @attributes
        end

        def geofence
            load_details!
            @geofence
        end

        def beacons
            load_details!
            @beacons
        end

        def arrivalRssi
            load_details!
            @arrivalRssi

        end

        def departureRssi
            load_details!
            @departureRssi
        end

        private

        def merge!(place)
            @id = place.id
            @name = place.name
            @attributes = place.attributes
            @geofence = place.geofence
            @beacons = place.beacons
            @arrival_rssi = place.arrival_rssi
            @departure_rssi = place.departure_rssi
        end

        def load_details!
            return true if @loaded
            merge!(@client.place(@id))
            @loaded = true
        end

    end
end
