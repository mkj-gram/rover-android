# if Rails.env.development?
require 'colorize'
require 'faker'
namespace :account do
    def show_percentage(percent, color = :blue)
        if percent >= 100
            color = :green
        end
        print "\r#{percent.round(2)}%".colorize(color)
    end
    def show_finished(message = "created!", color = :green)
        show_percentage(100)
        print "\r#{message}".colorize(color) + "\n"
    end

    def show_error(err_message = "", color = :red)
        print "\nAn error occured see message below".colorize(color) + "\n"
        puts err_message.colorize(color)
    end

    def generate_eddystone_namespace
        uuid = SecureRandom.uuid
        return uuid[0..7] + uuid[24..uuid.length]
    end

    desc "Create an account"
    task :generate => :environment do
        begin
            # Turn off mongo output
            Rails.logger.level = ::Logger::FATAL
            Mongo::Logger.logger.level = ::Logger::INFO
            primary_account_email = ENV['EMAIL'] || "sean@rover.io"
            num_configurations = ENV['NUM_CONFIGURATIONS'] || 1000
            num_places = ENV['NUM_LOCATIONS'] || 300
            precentage_of_configurations_attached_to_places = ENV['CONFIGURATION_LOCATION_PERCENT'] || 0.9
            num_customers = ENV['NUM_CUSTOMERS'] || 1000
            configuration_names = ["Meaford Bakery","Meaford Produce","Meaford Butcher","Meaford Frozen","Meaford Cashier","Meaford Entrance","Meaford Bulk","Meaford International Foods","Liberty Bakery","Liberty Produce","Liberty Butcher","Liberty Frozen","Liberty Cashier","Liberty Entrance","Liberty Bulk","Liberty International Foods","Front Street Bakery","Front Street Produce","Front Street Butcher","Front Street Frozen","Front Street Cashier","Front Street Entrance","Front Street Bulk","Front Street International Foods","Centrepoint Bakery","Centrepoint Produce","Centrepoint Butcher","Centrepoint Frozen","Centrepoint Cashier","Centrepoint Entrance","Centrepoint Bulk","Centrepoint International Foods", "Innisville Bakery","Innisville Produce","Innisville Butcher","Innisville Frozen","Innisville Cashier","Innisville Entrance","Innisville Bulk","Innisville International Foods", "SquareOne Bakery","SquareOne Produce","SquareOne Butcher","SquareOne Frozen","SquareOne Cashier","SquareOne Entrance","SquareOne Bulk","SquareOne International Foods", "Shoppers World Bakery","Shoppers World Produce","Shoppers World Butcher","Shoppers World Frozen","Shoppers World Cashier","Shoppers World Entrance","Shoppers World Bulk","Shoppers World International Foods", "OC Centre Bakery","OC Centre Produce","OC Centre Butcher","OC Centre Frozen","OC Centre Cashier","OC Centre Entrance","OC Centre Bulk","OC Centre International Foods"].freeze
            configuration_tags = ["Layout A", "Layout B", "Layout C", "Fresh", "Low-Powered", "On-Shelf", "High-Powered", "Multi-Region", "Near Entrance", "Popular", "Sampler"].freeze
            place_tags = ["Suburban", "Rural", "Urban", "Downtown", "Outside-Parking", "Underground Parking", "In-Mall", "Region A"," Region B", "Region C", "Distric 1", "District 2", "District 3"].freeze

            puts "\n\nGenerating Account\n".colorize(:color =>  :black, :background => :white).underline

            puts "\nCreating primary user with email #{primary_account_email}"
            ActiveRecord::Base.transaction do
                show_percentage(0)
                user = User.create!(name: "Rover Demo", email: primary_account_email, password: "password", password_confirmation: "password", account_title: "Rover")
                @account = user.account
                show_finished

                # Add users
                # puts "Adding #{num_users} users to account #{@account.id}"
                # current_record = 1
                # num_users.times.each do
                #     user_email = Faker::Internet.email
                #     invite = @account.account_invites.create!(
                #         issuer_id: user.id,
                #         invited_email: user_email
                #     )
                #     User.create!(
                #         name: Faker::Name.name,
                #         email: user_email,
                #         password: "password",
                #         password_confirmation: "password",
                #         account_id: @account.id,
                #         account_invite_token: invite.token
                #     )
                #     show_percentage((current_record/num_users.to_f) * 100)
                #     current_record += 1
                # end
                # show_finished

                # Add places
                # 32.549156, -117.102067
                # 57.804427, -71.313488
                rng = Random.new(Time.now.to_i)
                minLat = 32.549156
                maxLat = 57.804427
                minLng = -117.102067
                maxLng = -71.313488
                puts "Adding #{num_places} places to account #{@account.id}"
                current_record = 1
                places = []
                num_places.times.each do
                    lat = minLat + rng.rand * (maxLat - minLat)
                    lng = minLng + rng.rand * (maxLng - minLng)
                    places << Place.create!(
                        account_id: @account.id,
                        title: Faker::Address.street_name,
                        address: Faker::Address.street_address,
                        city: Faker::Address.city,
                        province: Faker::Address.state,
                        postal_code: Faker::Address.zip_code,
                        country: Faker::Address.country,
                        latitude: lat,
                        longitude: lng,
                        radius: Random.rand(500) + 50,
                        tags: place_tags.sample(rand(3))
                    )
                    show_percentage((current_record/num_places.to_f) * 100)
                    current_record += 1
                end
                show_finished

                # Add BeaconConfigurations
                uuids = 5.times.map{ SecureRandom.uuid.upcase }
                puts "Adding #{num_configurations} ibeacon configurations #{@account.id}"
                current_record = 1
                ibeacon_configurations = []
                num_configurations.times.each do
                    # configurations <<
                    config = IBeaconConfiguration.new(
                        account_id: @account.id,
                        uuid: uuids.sample,
                        major: Random.rand(5000),
                        minor: Random.rand(5000),
                        title: configuration_names.sample,
                        tags: configuration_tags.sample(rand(4))
                    )
                    config.save(validate: false)
                    ibeacon_configurations << config
                    show_percentage((current_record/num_configurations.to_f) * 100)
                    current_record += 1
                end
                show_finished

                num_configurations_to_attach = ibeacon_configurations.size * precentage_of_configurations_attached_to_places.to_f
                configurations_to_attach = ibeacon_configurations.last(num_configurations_to_attach)

                puts "Attaching #{num_configurations_to_attach.floor} configurations to random places"
                current_record = 1
                configurations_to_attach.each do |config|
                    config.update_attributes({place_id: places.sample.id})
                    show_percentage((current_record/num_configurations_to_attach.to_f) * 100)
                    current_record += 1
                end
                show_finished

                puts "Reindexing places"
                show_percentage(0)
                Place.where(account_id: @account.id).import
                show_percentage(100)
                show_finished
                # Generate a list of customers
                # All will have a random place
                languages = ["en", "fr", "es", "ko"]
                os_name = ["iOS", "Android"]
                android_os_versions = ["4.0", "4.0.2", "4.1", "4.3.1", "4.4", "5.0", "5.1.1", "6.0", "6.0.1"]
                ios_os_versions = ["5.1.1", "6.1.6", "7.1.2", "8.3", "9.2.1"]
                region = ["ca", "us"]
                gender = ["male", "female"]
                timezones = ["America/Toronto", "America/New_York", "America/Fort_Nelson"]
                models = ["iPhone", "Google"]
                true_false = [true, false]
                puts "Adding #{num_customers} Customers to account #{@account.id}"
                current_record = 1
                num_customers.times do
                    lat = minLat + rng.rand * (maxLat - minLat)
                    lng = minLng + rng.rand * (maxLng - minLng)
                    os = os_name.sample
                    version = os == "iOS" ? ios_os_versions.sample : android_os_versions.sample
                    model = os == "iOS" ? "iPhone" : "Google"
                    c = Customer.new(account_id: @account.id, identifier: SecureRandom.uuid, name: Faker::Name.name, email: Faker::Internet.email, age: 15 + rand(40), gender: gender.sample, place: GeoPoint.new(latitude: lat, longitude: lng) )
                    c.devices.build(udid: SecureRandom.uuid, locale_lang: languages.sample, locale_region: region.sample, time_zone: timezones.sample, sdk_version: "4.0.0", os_name: os, os_version: version, model: model, background_enabled: true_false.sample, local_notifications_enabled: true_false.sample, notifications_enabled: true_false.sample, bluetooth_enabled: true_false.sample, place_monitoring_enabled: true_false.sample  )
                    c.save
                    show_percentage((current_record/ num_customers.to_f) * 100)
                    current_record += 1
                end
                show_finished

                puts "Adding customers to the Toronto area"
                minLat = 43.650222
                maxLat = 43.664752
                minLng = -79.411837
                maxLng = -79.357249
                current_record = 1
                (num_customers * 0.1).floor.times do
                    lat = minLat + rng.rand * (maxLat - minLat)
                    lng = minLng + rng.rand * (maxLng - minLng)
                    os = os_name.sample
                    version = os == "iOS" ? ios_os_versions.sample : android_os_versions.sample
                    model = os == "iOS" ? "iPhone" : "Google"
                    c = Customer.new(account_id: @account.id, identifier: SecureRandom.uuid, name: Faker::Name.name, email: Faker::Internet.email, age: 15 + rand(40), gender: gender.sample, place: GeoPoint.new(latitude: lat, longitude: lng) )
                    c.devices.build(udid: SecureRandom.uuid, locale_lang: languages.sample, locale_region: region.sample, time_zone: timezones.sample, sdk_version: "4.0.0", os_name: os, os_version: version, model: model, background_enabled: true_false.sample, local_notifications_enabled: true_false.sample, notifications_enabled: true_false.sample, bluetooth_enabled: true_false.sample, place_monitoring_enabled: true_false.sample  )
                    c.save
                    show_percentage((current_record/ num_customers.to_f) * 100)
                    current_record += 1
                end
                show_finished

                puts "Adding 5 customer segments"
                show_percentage(0)
                segment = CustomerSegment.new(
                    account_id: @account.id,
                    title: "Customers who have bluetooth turned off",
                    filters: [
                        {
                            "model" => "device",
                            "attribute" => "bluetooth-enabled",
                            "comparer" => {
                                "method" => "equal",
                                "value" => false
                            }
                        }
                    ]
                )
                segment.save
                show_percentage(20)
                segment = CustomerSegment.new(
                    account_id: @account.id,
                    title: "Customers who are male between the age of 25 and 35 with an english phone",
                    filters: [
                        {
                            "model" => "customer",
                            "attribute" => "age",
                            "comparer" => {
                                "method" => "range",
                                "from" => 25,
                                "to" => 35
                            }
                        },
                        {
                            "model" => "customer",
                            "attribute" => "gender",
                            "comparer" => {
                                "method" => "equal",
                                "value" => "male"
                            }
                        },
                        {
                            "model" => "device",
                            "attribute" => "locale-lang",
                            "comparer" => {
                                "method" => "in",
                                "value" => ["en"]
                            }
                        }
                    ]
                )
                segment.save
                show_percentage(40)
                segment = CustomerSegment.new(
                    account_id: @account.id,
                    title: "Customers who are in Toronto who have an Android device",
                    filters: [
                        {
                            "model" => "device",
                            "attribute" => "os-name",
                            "comparer" => {
                                "method" => "equal",
                                "value" => "Android"
                            }
                        },
                        {
                            "model" => "customer",
                            "attribute" => "place",
                            "comparer" => {
                                "method" => "geofence",
                                "latitude" => 43.662469,
                                "longitude" => -79.395695,
                                "radius" => 3350
                            }
                        }
                    ]
                )
                segment.save
                show_percentage(60)
                segment = CustomerSegment.new(
                    account_id: @account.id,
                    title: "Customers who are female who are 25 and older who have an ios device and french device",
                    filters: [
                        {
                            "model" => "customer",
                            "attribute" => "gender",
                            "comparer" => {
                                "method" => "equal",
                                "value" => "female"
                            }
                        },
                        {
                            "model" => "device",
                            "attribute" => "os-name",
                            "comparer" => {
                                "method" => "equal",
                                "value" => "iOS"
                            }
                        },
                        {
                            "model" => "customer",
                            "attribute" => "age",
                            "comparer" => {
                                "method" => "range",
                                "from" => 25,
                            }
                        },
                        {
                            "model" => "device",
                            "attribute" => "locale-lang",
                            "comparer" => {
                                "method" => "in",
                                "value" => ["fr"]
                            }
                        },

                    ]
                )
                segment.save
                show_percentage(80)
                segment = CustomerSegment.new(
                    account_id: @account.id,
                    title: "Customers who are 25 and younger with an Android device",
                    filters: [
                        {
                            "model" => "device",
                            "attribute" => "os-name",
                            "comparer" => {
                                "method" => "equal",
                                "value" => "Android"
                            }
                        },
                        {
                            "model" => "customer",
                            "attribute" => "age",
                            "comparer" => {
                                "method" => "range",
                                "to" => 25,
                            }
                        },
                    ]
                )
                segment.save
                show_percentage(100)
                show_finished

                message_beacon = IBeaconConfiguration.create(
                    account_id: @account.id,
                    uuid: uuids.sample,
                    major: Random.rand(5000),
                    minor: Random.rand(5000),
                    title: configuration_names.sample,
                    tags: configuration_tags.sample(rand(4))
                )

                message = ProximityMessageTemplate.new(
                    {
                        "account_id"=> @account.id,
                        "type"=>"ProximityMessageTemplate",
                        "title"=>"Recipes for the BBQ Season",
                        "notification_text"=>"Get Great recipes of this bbq seaon",
                        "published"=>true,
                        "archived"=>false,
                        "save_to_inbox"=>true,
                        "date_schedule"=>-Float::INFINITY...Float::INFINITY,
                        "time_schedule"=>0..1440,
                        "schedule_monday"=>true,
                        "schedule_tuesday"=>true,
                        "schedule_wednesday"=>true,
                        "schedule_thursday"=>true,
                        "schedule_friday"=>true,
                        "schedule_saturday"=>true,
                        "schedule_sunday"=>true,
                        "trigger_event_id"=>22,
                        "dwell_time_in_seconds"=>nil,
                        "customer_segment_id"=>nil,
                        "limits"=>[{"message_limit"=>1, "number_of_days"=>30}],
                        "filter_beacon_configuration_tags"=>[],
                        "filter_beacon_configuration_ids"=>[],
                        "filter_place_tags"=>[],
                    "filter_place_ids"=>[]},

                )
                message.save

                message = ProximityMessageTemplate.new(
                    {
                        "account_id"=>@account.id,
                        "type"=>"ProximityMessageTemplate",
                        "title"=>"In-Store Samples",
                        "notification_text"=>"Don't miss this afternoon's in-store samples for VH Sweet and Sour Chicken and Vitamin Water",
                        "published"=>true,
                        "archived"=>false,
                        "save_to_inbox"=>true,
                        "date_schedule"=>1458518400...1458691201,
                        "time_schedule"=>0..1440,
                        "schedule_monday"=>true,
                        "schedule_tuesday"=>true,
                        "schedule_wednesday"=>true,
                        "schedule_thursday"=>true,
                        "schedule_friday"=>true,
                        "schedule_saturday"=>true,
                        "schedule_sunday"=>true,
                        "trigger_event_id"=>2,
                        "dwell_time_in_seconds"=>nil,
                        "customer_segment_id"=>nil,
                        "limits"=>[{"message_limit"=>1, "number_of_days"=>1}],
                        "filter_beacon_configuration_tags"=>[],
                        "filter_beacon_configuration_ids"=>[],
                        "filter_place_tags"=>["Urban", "Region A"],
                        "filter_place_ids"=>[]
                    }
                )
                message.save

                segment = CustomerSegment.create(
                    {
                        "account_id"=>@account.id,
                        "title"=>"Sports Fans",
                        "filters"=>[{"model"=>"customer", "attribute"=>"gender", "comparer"=>{"method"=>"equal", "value"=>"male"}}, {"model"=>"customer", "attribute"=>"age", "comparer"=>{"method"=>"range", "from"=>29, "to"=>nil}}, {"model"=>"device", "attribute"=>"locale-lang", "comparer"=>{"method"=>"in", "value"=>["en"]}}, {"model"=>"customer", "attribute"=>"place", "comparer"=>{"method"=>"geofence", "longitude"=>-79.38918419999999, "latitude"=>43.6756957, "radius"=>3500}}],
                    }
                )

                message = ProximityMessageTemplate.new(
                    {
                        "account_id"=>@account.id,
                        "type"=>"ProximityMessageTemplate",
                        "title"=>"Superbowl Weekend",
                        "notification_text"=>"It's Superbowl Weekend! Stock up on all the essential snacking and dining supplies for you party",
                        "published"=>true,
                        "archived"=>false,
                        "save_to_inbox"=>true,
                        "date_schedule"=>1458691200...1461369601,
                        "time_schedule"=>0..1440,
                        "schedule_monday"=>false,
                        "schedule_tuesday"=>false,
                        "schedule_wednesday"=>false,
                        "schedule_thursday"=>true,
                        "schedule_friday"=>true,
                        "schedule_saturday"=>true,
                        "schedule_sunday"=>true,
                        "trigger_event_id"=>22,
                        "dwell_time_in_seconds"=>nil,
                        "customer_segment_id"=>segment.id,
                        "limits"=>[{"message_limit"=>1, "number_of_days"=>1}],
                        "filter_beacon_configuration_tags"=>["Popular"],
                        "filter_beacon_configuration_ids"=>[],
                        "filter_place_tags"=>["Downtown"],
                        "filter_place_ids"=>[]
                    }
                )

                message.save
                segment = CustomerSegment.create(
                    {
                        "account_id"=>@account.id,
                        "title"=>"DealHounds",
                        "filters"=>[{"model"=>"customer", "attribute"=>"gender", "comparer"=>{"method"=>"equal", "value"=>"female"}}],
                    }
                )
                message = ProximityMessageTemplate.new(

                    {
                        "account_id"=>@account.id,
                        "type"=>"ProximityMessageTemplate",
                        "title"=>"Bakery Deals",
                        "notification_text"=>"Save on Dempster's Gluten-Free Ancient Grain products",
                        "published"=>true,
                        "archived"=>false,
                        "save_to_inbox"=>true,
                        "date_schedule"=>1456876800...1458259201,
                        "time_schedule"=>0..1440,
                        "schedule_monday"=>true,
                        "schedule_tuesday"=>true,
                        "schedule_wednesday"=>true,
                        "schedule_thursday"=>true,
                        "schedule_friday"=>true,
                        "schedule_saturday"=>true,
                        "schedule_sunday"=>true,
                        "trigger_event_id"=>22,
                        "dwell_time_in_seconds"=>nil,
                        "customer_segment_id"=>segment.id,
                        "limits"=>[{"message_limit"=>1, "number_of_days"=>1}, {"message_limit"=>3, "number_of_days"=>14}],
                        "filter_beacon_configuration_tags"=>[],
                        "filter_beacon_configuration_ids"=>ibeacon_configurations.sample(3).map(&:id),
                        "filter_place_tags"=>[],
                        "filter_place_ids"=>[]
                    }

                )
                message.save

                message = ProximityMessageTemplate.new(
                    {
                        "account_id"=>@account.id,
                        "type"=>"ProximityMessageTemplate",
                        "title"=>"Thanks for visiting",
                        "notification_text"=>"Thanks for visiting! Gas up on the way home with $5 off coupon at Teaxo",
                        "published"=>true,
                        "archived"=>false,
                        "save_to_inbox"=>true,
                        "date_schedule"=>-Float::INFINITY...Float::INFINITY,
                        "time_schedule"=>0..1440,
                        "schedule_monday"=>true,
                        "schedule_tuesday"=>true,
                        "schedule_wednesday"=>true,
                        "schedule_thursday"=>true,
                        "schedule_friday"=>true,
                        "schedule_saturday"=>true,
                        "schedule_sunday"=>true,
                        "trigger_event_id"=>23,
                        "dwell_time_in_seconds"=>nil,
                        "customer_segment_id"=>nil,
                        "limits"=>[{"message_limit"=>2, "number_of_days"=>1}, {"message_limit"=>3, "number_of_days"=>7}],
                        "filter_beacon_configuration_tags"=>["At Cash"],
                        "filter_beacon_configuration_ids"=>[],
                        "filter_place_tags"=>[], "filter_place_ids"=>[]
                    }
                )
                message.save
                # Create Proximity Messages with a random segment attached


                puts "Generating user session for #{user.name}"
                show_percentage(0)
                @session = Session.build_session(user)
                @session.save!
                show_finished

                puts "\nFinished below are your api-keys".colorize(:green)
                puts "X-Rover-REST-API-Key: #{@account.token}".colorize(:green)
                puts "JWT Token: #{@session.token}".colorize(:green)
            end
        rescue Exception => e
            show_error(e.message)
            show_error("Rolling back")
        end


    end
end

# end
