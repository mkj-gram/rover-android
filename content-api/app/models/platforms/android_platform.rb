class AndroidPlatform < ActiveRecord::Base
    include Platformable

    # validates :api_key, presence: true
    # validates :package_name, presence: true
    validates :api_key, presence: true, allow_blank: true, if: -> { !new_record? && sender_id.nil? && messaging_token.nil? }
    validates :sender_id, presence: true, allow_blank: true, if: -> { !new_record? && api_key.nil? }
    validates :messaging_token, presence: true, allow_blank: true, if: -> { !new_record? && api_key.nil? }
    belongs_to :account

    # before_save :update_name_cache

    private

    def update_name_cache
        if title_changed?
            account.update_attributes(android_platform_name: self.title)
        end
    end
end
