class BeaconRegionExitEvent < BeaconRegionEvent


    def save
        # only writing is the event
        # create a visit in the background
        # write to mongo
        # update the customer elasticsearch document
        # when creating a visit check to see if there is any dwell messages
        # if so queue to perform in dwell time
        super
    end

end
