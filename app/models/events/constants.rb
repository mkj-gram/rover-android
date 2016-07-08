module Events
    module Constants

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

        # Gimbal Events 81-100
        GIMBAL_PLACE_EVENT_ID = 81
        GIMBAL_PLACE_ENTER_EVENT_ID = 82
        GIMBAL_PLACE_EXIT_EVENT_ID = 83

        # Message Events 101-120
        MESSAGE_EVENT_ID = 101
        MESSAGE_ADDED_TO_INBOX_EVENT_ID = 102
        MESSAGE_OPENED_EVENT_ID = 103 # could be from notification or inbox
        MESSAGE_DELETED_EVENT_ID = 104

        # Notification Events 121-140
        NOTIFICATION_SENT = 121
        NOTIFICATION_FAILED = 122

        # Rate limiting events 141-160
        GLOBAL_RATE_LIMIT_EXCEEDED = 141
        MESSAGE_RATE_LIMIT_EXCEEDED = 142  # this is only for proximity events

    end
end
