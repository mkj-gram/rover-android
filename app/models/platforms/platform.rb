class Platform < ActiveRecord::Base
    attr_encrypted :credentials, key: proc { Platform.encryption_key }, mode: :per_attribute_iv_and_salt, marshal: true



    private

    def self.encryption_key
        Rails.application.secrets.secret_encryption_key.freeze
    end
end
