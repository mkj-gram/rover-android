class AndroidPlatform < Platform

    validates :api_key, presence: true
    validates :package_name, presence: true


    alias_attribute :package_name, :app_identifier
    alias_attribute :api_key, :credentials

end
