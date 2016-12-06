require 'rails_helper'

describe Events::NotificationEvents, "new" do
    
    before(:each) do
        @message = Message.from_document({"_id"=>"5845bff067fc285ff88b9a25", "customer_id"=>"5845bdf5773c9c5ceff98ee9", "message_template_id"=>1, "notification_text"=>"Hello", "ios_title"=>"", "android_title"=>"", "ios_sound_file"=>nil, "android_sound_file"=>nil, "tags"=>[], "read"=>false, "viewed"=>false, "saved_to_inbox"=>true, "content_type"=>"experience", "website_url"=>nil, "deeplink_url"=>nil, "experience_id"=>"57bdb4b2c69a283797b6e990", "timestamp"=>"2016-12-05T19:28:48.329Z", "expire_at"=>nil, "landing_page"=>nil, "properties"=>nil})
        @customer = Customer.from_document({"updated_at"=>"2016-12-05T19:27:39.957Z", "document_bucket"=>5, "devices"=>[{"app_identifier"=>"io.rover.debug", "background_enabled"=>true, "development"=>true, "platform"=>"iOS", "os_name"=>"iOS", "model"=>"x86_64", "locale_lang"=>"en", "time_zone"=>"America/Toronto", "sdk_version"=>"1.3.0", "os_version"=>"10.1.0", "bluetooth_enabled"=>false, "aid"=>"5B2E1209-B59B-4A09-B6C2-BB7C74482A77", "locale_region"=>"us", "location_monitoring_enabled"=>true, "manufacturer"=>"Apple", "carrier"=>nil, "_id"=>"EAE5A483-8C40-427F-92DB-8AD2768D062C", "notifications_enabled"=>false, "location"=>{"latitude"=>47.623959, "longitude"=>-122.306999, "accuracy"=>50, "timestamp"=>"2016-12-05T19:27:39.956Z"}, "beacon_regions_monitoring_updated_at"=>"2016-12-05T19:20:21.924Z", "geofence_regions_monitoring_updated_at"=>"2016-12-05T19:20:21.933Z", "updated_at"=>"2016-12-05T19:22:22.023Z", "token"=>"123123123"}], "inbox_updated_at"=>"2016-12-05T19:27:39.954Z", "account_id"=>1, "tags"=>[], "age"=>nil, "gender"=>nil, "email"=>nil, "first_name"=>nil, "last_name"=>nil, "phone_number"=>nil, "_id"=>"5845bdf5773c9c5ceff98ee9"}.with_indifferent_access)
        @device = @customer.devices.first
    end

    it 'generates palce triggered arguments for its attributes' do


        trigger_arguments = {"_place"=>{"id"=>3, "account_id"=>1, "title"=>"sdasd", "address"=>"522 19th Avenue East", "city"=>"Seattle", "province"=>"WA", "country"=>"United States", "postal_code"=>"98112", "latitude"=>47.623959, "longitude"=>-122.306999, "radius"=>50, "tags"=>[], "google_place_id"=>"ChIJN0EehSoVkFQRQbqhHTIYQ04", "enabled"=>true, "shared"=>false, "beacon_configurations_count"=>0, "created_at"=>"2016-09-12T19:58:46.565Z", "updated_at"=>"2016-09-12T19:58:46.565Z"}}.with_indifferent_access
        
        input = {
            message: @message,
            trigger_event_id: 2
        }

        extra = {
            customer: @customer,
            device: @device,
            trigger_arguments: trigger_arguments
        }

        event = Events::Pipeline.build("notification", "sent", input, extra)

        record = event.attributes

        expect(record).to include(:event, :customer, :device, :place, :message)

        # expect(record[:place]).to eq(trigger_arguments[:_place])

        expect(record[:event]).to include(:trigger_event_id)
        expect(record[:event][:trigger_event_id]).to eq(2)
    end

    it 'generates palce triggered arguments for its attributes' do
        
        configurationId = 554
        trigger_arguments = {"_beaconConfiguration"=>{"id"=>configurationId, "account_id"=>1, "place_id"=>nil, "title"=>"aaaa", "tags"=>[], "enabled"=>true, "shared"=>false, "uuid"=>"647086E7-89A6-439C-9E3B-4A2268F13FC7", "major"=>1, "minor"=>1, "namespace"=>nil, "instance_id"=>nil, "url"=>nil, "beacon_devices_updated_at"=>nil, "created_at"=>"2016-09-12T17:51:15.538Z", "updated_at"=>"2016-09-12T17:51:15.538Z", "registered_with_google"=>false, "has_pending_google_updates"=>false, "indoor_level"=>nil, "google_beacon_name"=>nil, "google_sync_error"=>false, "google_sync_error_message"=>nil} }.with_indifferent_access
        
        input = {
            message: @message,
            trigger_event_id: 22
        }

        extra = {
            customer: @customer,
            device: @device,
            trigger_arguments: trigger_arguments
        }

        event = Events::Pipeline.build("notification", "sent", input, extra)

        record = event.attributes

        expect(record).to include(:event, :customer, :device, :configuration, :message)

        # expect(record[:place]).to eq(trigger_arguments[:_place])

        expect(record[:event]).to include(:trigger_event_id)
        expect(record[:event][:trigger_event_id]).to eq(22)

        expect(record[:configuration][:id]).to eq(configurationId)
    end
end