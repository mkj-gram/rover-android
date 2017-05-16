class AddSenderIdToAndroidPlatformsCredentials < ActiveRecord::Migration
    
    def up
        # credentials is storing just a string we need to convert it to a hash
        AndroidPlatform.find_each(batch_size: 100) do |platform|
            api_key = platform.credentials
            platform.update(credentials: { api_key: api_key })
        end
    end

    def down
        AndroidPlatform.find_each(batch_size: 100) do |platform|
            api_key = platform.credentials[:api_key]
            platform.update(credentials: api_key)
        end
    end

end
