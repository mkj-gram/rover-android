require 'rails_helper'

describe Events::NotificationEvents, "new" do
    it 'generates triggered arguments for its attributes' do
        message = Message.from_document({"_id"=>"5845bff067fc285ff88b9a25", "customer_id"=>"5845bdf5773c9c5ceff98ee9", "message_template_id"=>1, "notification_text"=>"Hello", "ios_title"=>"", "android_title"=>"", "ios_sound_file"=>nil, "android_sound_file"=>nil, "tags"=>[], "read"=>false, "viewed"=>false, "saved_to_inbox"=>true, "content_type"=>"experience", "website_url"=>nil, "deeplink_url"=>nil, "experience_id"=>"57bdb4b2c69a283797b6e990", "timestamp"=>"2016-12-05T19:28:48.329Z", "expire_at"=>nil, "landing_page"=>nil, "properties"=>nil})
        customer = Customer.from_document({"updated_at"=>"2016-12-05T19:27:39.957Z", "document_bucket"=>5, "devices"=>[{"app_identifier"=>"io.rover.debug", "background_enabled"=>true, "development"=>true, "platform"=>"iOS", "os_name"=>"iOS", "model"=>"x86_64", "locale_lang"=>"en", "time_zone"=>"America/Toronto", "sdk_version"=>"1.3.0", "os_version"=>"10.1.0", "bluetooth_enabled"=>false, "aid"=>"5B2E1209-B59B-4A09-B6C2-BB7C74482A77", "locale_region"=>"us", "location_monitoring_enabled"=>true, "manufacturer"=>"Apple", "carrier"=>nil, "_id"=>"EAE5A483-8C40-427F-92DB-8AD2768D062C", "notifications_enabled"=>false, "location"=>{"latitude"=>47.623959, "longitude"=>-122.306999, "accuracy"=>50, "timestamp"=>"2016-12-05T19:27:39.956Z"}, "beacon_regions_monitoring_updated_at"=>"2016-12-05T19:20:21.924Z", "geofence_regions_monitoring_updated_at"=>"2016-12-05T19:20:21.933Z", "updated_at"=>"2016-12-05T19:22:22.023Z", "token"=>"123123123"}], "inbox_updated_at"=>"2016-12-05T19:27:39.954Z", "account_id"=>1, "tags"=>[], "age"=>nil, "gender"=>nil, "email"=>nil, "first_name"=>nil, "last_name"=>nil, "phone_number"=>nil, "_id"=>"5845bdf5773c9c5ceff98ee9"}.with_indifferent_access)
        device = customer.devices.first


        trigger_arguments = {"_place"=>{"id"=>3, "account_id"=>1, "title"=>"sdasd", "address"=>"522 19th Avenue East", "city"=>"Seattle", "province"=>"WA", "country"=>"United States", "postal_code"=>"98112", "latitude"=>47.623959, "longitude"=>-122.306999, "radius"=>50, "tags"=>[], "google_place_id"=>"ChIJN0EehSoVkFQRQbqhHTIYQ04", "enabled"=>true, "shared"=>false, "beacon_configurations_count"=>0, "created_at"=>"2016-09-12T19:58:46.565Z", "updated_at"=>"2016-09-12T19:58:46.565Z"}}.with_indifferent_access
        
        input = {
            message: message,
            trigger_event_id: 2
        }

        extra = {
            customer: customer,
            device: device,
            trigger_arguments: trigger_arguments
        }

        event = Events::Pipeline.build("notification", "sent", input, extra)

        record = event.attributes

        expect(record).to include(:event, :customer, :device, :place, :message)

        # expect(record[:place]).to eq(trigger_arguments[:_place])

        expect(record[:event]).to include(:trigger_event_id)
        expect(record[:event][:trigger_event_id]).to eq(2)
    end
end