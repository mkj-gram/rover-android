class AndroidPlatform < ActiveRecord::Base
    include Platformable

    # validates :api_key, presence: true
    # validates :package_name, presence: true


    alias_attribute :package_name, :app_identifier
    alias_attribute :api_key, :credentials

    before_save :update_name_cache


    def account
        @account ||= Account.find(self.account_id)
    end

    private

    def update_name_cache
        if self.changes.include?(:title)
            account.update_attributes(android_platform_name: self.title)
        end
    end

end
