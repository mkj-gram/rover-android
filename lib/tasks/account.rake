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
            primary_account_email = ENV['EMAIL'] || "sean@rover.io"
            num_users = ENV['NUM_USERS'] || 0
            num_configurations = 500
            num_locations = ENV['NUM_LOCATIONS'] || 500

            share_account_id = ENV['SHARE_ACCOUNT_ID']

            puts "\n\nGenerating Account\n".colorize(:color =>  :black, :background => :white).underline

            puts "\nCreating primary user with email #{primary_account_email}"
            ActiveRecord::Base.transaction do
                show_percentage(0)
                user = User.create!(name: "Rover Test", email: primary_account_email, password: "password", password_confirmation: "password", account_title: "Rover")
                @account = user.account
                show_finished

                # Add users
                puts "Adding #{num_users} users to account #{@account.id}"
                current_record = 1
                num_users.times.each do
                    user_email = Faker::Internet.email
                    invite = @account.account_invites.create!(
                        issuer_id: user.id,
                        invited_email: user_email
                    )
                    User.create!(
                        name: Faker::Name.name,
                        email: user_email,
                        password: "password",
                        password_confirmation: "password",
                        account_id: @account.id,
                        account_invite_token: invite.token
                    )
                    show_percentage((current_record/num_users.to_f) * 100)
                    current_record += 1
                end
                show_finished

                # Add locations
                # puts "Adding #{num_locations} locations to account #{@account.id}"
                # current_record = 1
                # locations = []
                # num_locations.times.each do
                #     locations << Location.create!(
                #         account_id: @account.id,
                #         name: Faker::Address.street_name,
                #         address: Faker::Address.street_address,
                #         city: Faker::Address.city,
                #         province_state: Faker::Address.state,
                #         postal_zip: Faker::Address.zip_code,
                #         country: Faker::Address.country,
                #         latitude: Faker::Address.latitude,
                #         longitude: Faker::Address.longitude,
                #         radius: Random.rand(500) + 50,
                #         tags: Faker::Hipster.words(Random.rand(5), true, true)
                #     )
                #     show_percentage((current_record/num_locations.to_f) * 100)
                #     current_record += 1
                # end
                # show_finished

                # Add BeaconConfigurations
                puts "Adding #{num_configurations} ibeacon configurations #{@account.id}"
                current_record = 1
                ibeacon_configurations = []
                num_configurations.times.each do
                    # configurations <<
                    config = IBeaconConfiguration.new(
                        account_id: @account.id,
                        uuid: SecureRandom.uuid.upcase,
                        major: Random.rand(5000),
                        minor: Random.rand(5000),
                        title: Faker::Commerce.product_name,
                        tags: Faker::Hipster.words(Random.rand(5), true, true)
                    )
                    ibeacon_configurations << config.save(validate: false)
                    show_percentage((current_record/num_configurations.to_f) * 100)
                    current_record += 1
                end
                show_finished

                puts "Adding #{num_configurations} eddystone configurations #{@account.id}"
                current_record = 1
                eddystone_configurations = []
                num_configurations.times.each do
                    # configurations <<
                    config = EddystoneNamespaceConfiguration.new(
                        account_id: @account.id,
                        namespace: generate_eddystone_namespace,
                        instance_id: Random.rand(6000),
                        title: Faker::Commerce.product_name,
                        tags: Faker::Hipster.words(Random.rand(5), true, true)
                    )
                    eddystone_configurations << config.save(validate: false)
                    show_percentage((current_record/num_configurations.to_f) * 100)
                    current_record += 1
                end
                show_finished

                puts "Adding #{num_configurations} url configurations #{@account.id}"
                current_record = 1
                url_configurations = []
                num_configurations.times.each do
                    # configurations <<
                    config = UrlConfiguration.new(
                        account_id: @account.id,
                        url: (0...10).map { ('a'..'z').to_a[rand(26)] }.join,
                        title: Faker::Commerce.product_name,
                        tags: Faker::Hipster.words(Random.rand(5), true, true)
                    )
                    url_configurations << config.save(validate: false)
                    show_percentage((current_record/num_configurations.to_f) * 100)
                    current_record += 1
                end
                show_finished


                # Add Beacons
                # puts "Adding #{num_beacons} beacons to account #{account.id}"
                # current_record = 1
                # beacons_attached_to_location = 0
                # beacons = []
                # num_beacons.times.each do
                #     beacon = Beacon.new(
                #         account_id: account.id,
                #         name: Faker::App.name,
                #         manufacturer: Beacon.manufacturers[:estimote],
                #         manufacturer_id: SecureRandom.uuid,
                #         enabled: true,
                #         tags: Faker::Hipster.words(Random.rand(5), true, true).join(" "),
                #         color: Faker::Color.hex_color
                #     )
                #     if Random.rand(5) == 2
                #         beacon.location_id = locations.sample.id
                #         beacons_attached_to_location += 1
                #     end
                #     beacons << beacon.save!
                #     show_percentage((current_record/num_beacons.to_f) * 100)
                #     current_record += 1
                # end
                # show_finished
                # puts "#{beacons_attached_to_location} beacons attached to random locations"

                # if share_account_id
                #     locations_to_share_count = num_locations / 4
                #     beacons_to_share_count = num_beacons / 4
                #     puts "\nDetected SHARE_ACCOUNT_ID present! sharing #{locations_to_share_count} locations & #{beacons_to_share_count} beacons with account #{share_account_id}".colorize(:light_blue).underline
                # end

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
