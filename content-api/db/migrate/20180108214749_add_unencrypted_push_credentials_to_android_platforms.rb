class AddUnencryptedPushCredentialsToAndroidPlatforms < ActiveRecord::Migration
    def up

        add_column :android_platforms, :api_key, :string, default: nil
        add_column :android_platforms, :sender_id, :string, default: nil
        add_column :android_platforms, :messaging_token, :string, default: nil

        AndroidPlatform.all.each do |platform|

            if platform.credentials.present?
                platform.api_key = platform.credentials[:api_key]
                platform.sender_id  = platform.credentials[:sender_id]
                platform.messaging_token  = platform.credentials[:messaging_token]
                platform.save!  
            end
           
        end
    end


    def down

        remove_column :android_platforms, :api_key
        remove_column :android_platforms, :sender_id
        remove_column :android_platforms, :messaging_token

    end
end
