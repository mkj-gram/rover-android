class BeaconRegionEnterEvent < BeaconRegionEvent


    def save
        # only writing is the event
        # create a visit in the background
        # write to mongo
        # update the customer elasticsearch document
        # when creating a visit check to see if there is any dwell messages
        # if so queue to perfom in dwell time
    end

    def json_response
    end
end
