class AndroidPlatform < ActiveRecord::Base
    include Platformable

    # validates :api_key, presence: true
    # validates :package_name, presence: true

    belongs_to :account
    
    alias_attribute :api_key, :credentials

    # before_save :update_name_cache


    

    private

    def update_name_cache
        if title_changed?
            account.update_attributes(android_platform_name: self.title)
        end
    end

end
