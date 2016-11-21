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

    def api_key=(new_api_key)
        self.credentials = (credentials || {}).merge(:api_key => new_api_key)
    end

    def sender_id=(new_sender_id)
        self.credentials = (credentials || {}).merge(:sender_id => new_sender_id)
    end
    

    private

    def update_name_cache
        if title_changed?
            account.update_attributes(android_platform_name: self.title)
        end
    end

end
