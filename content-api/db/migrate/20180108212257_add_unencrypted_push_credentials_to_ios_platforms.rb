class AddUnencryptedPushCredentialsToIosPlatforms < ActiveRecord::Migration
    def up

        add_column :ios_platforms, :apns_certificate, :string, default: nil
        add_column :ios_platforms, :apns_passphrase, :string, default: nil

        IosPlatform.all.each do |platform|

            if platform.credentials.present?
                platform.certificate = platform.credentials[:certificate]
                platform.passphrase  = platform.credentials[:passphrase]

                platform.save!
            end
            
        end
    end


    def down

        remove_column :ios_platforms, :apns_certificate
        remove_column :ios_platforms, :apns_passphrase

    end
end


