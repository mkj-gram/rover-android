class BeaconRegionEnterEvent < BeaconRegionEvent


    def save
        # only writing is the event
        # create a visit in the background
        # write to mongo
        # update the customer elasticsearch document
        # when creating a visit check to see if there is any dwell messages
        # if so queue to perform in dwell time
    end

    def json_response
        super
        add_to_json_included(serialize_beacon_configuration(beacon_configuration)) if beacon_configuration
        return json
    end
end
