FactoryGirl.define do
    factory :proximity_message, class: "ProximityMessageTemplate" do
        account
        type "ProximityMessageTemplate"
        title "Proximity Message"
        tags ["message_tag_1", "message_tag_2"]
        notification_text "hello"
        published true
        archived false
        save_to_inbox true
        trigger_event_id Events::Constants::BEACON_REGION_ENTER_EVENT_ID
        schedule_end_time 1
        content_type "custom"
    end
end
