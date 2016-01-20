class ThirdPartyIntegration < ActiveRecord::Base
    attr_encrypted :credentials, key: proc { ThirdPartyIntegration.encryption_key }, mode: :per_attribute_iv_and_salt, marshal: true

    belongs_to :account
    has_many :sync_jobs, class_name: "ThirdPartyIntegrationSyncJob", foreign_key:  "third_party_integration_id"

    private

    def self.encryption_key
        @encryption_key ||= Rails.application.secrets.secret_encryption_key
    end
end
