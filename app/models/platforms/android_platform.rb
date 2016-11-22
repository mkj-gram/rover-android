class AndroidPlatform < ActiveRecord::Base
    include Platformable

    # validates :api_key, presence: true
    # validates :package_name, presence: true

    belongs_to :account

    # before_save :update_name_cache


    def api_key
        if !credentials.nil? && credentials.is_a?(Hash)
            return credentials[:api_key]
        else
            return nil
        end
    end

    def sender_id
        if !credentials.nil? && credentials.is_a?(Hash)
            return credentials[:sender_id]
        else
            return nil
        end
    end

    def messaging_token
        if !credentials.nil? && credentials.is_a?(Hash)
            return credentials[:messaging_token]
        else
            return nil
        end
    end

    def api_key=(new_api_key)
        add_attribute_to_credentials(:api_token, new_api_key.to_s)
    end

    def sender_id=(new_sender_id)
        add_attribute_to_credentials(:sender_id, new_sender_id.to_s)
    end

    def messaging_token=(new_messaging_token)
        add_attribute_to_credentials(:messaging_token, new_messaging_token.to_s)
    end
    

    private

    def add_attribute_to_credentials(name, value)
         self.credentials = (credentials || {}).merge(name => value)
    end

    def update_name_cache
        if title_changed?
            account.update_attributes(android_platform_name: self.title)
        end
    end

end
