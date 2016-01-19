class ThirdPartyIntegration < ActiveRecord::Base
    attr_encrypted :credentials, key: :encryption_key



    private

    def encryption_key
        @encryption_key ||= Rails.application.secrets.secret_encryption_key
    end
end
