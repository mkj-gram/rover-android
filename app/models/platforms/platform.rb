class Platform < ActiveRecord::Base

    attr_encrypted :credentials, key: Rails.application.secrets.secret_encryption_key.freeze , mode: :per_attribute_iv_and_salt, marshal: true

end
