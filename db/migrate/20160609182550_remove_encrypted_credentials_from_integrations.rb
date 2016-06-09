class RemoveEncryptedCredentialsFromIntegrations < ActiveRecord::Migration

    def up
        add_column :third_party_integrations, :credentials, :jsonb, default: {}
        ThirdPartyIntegration.all.each do |integration|
            unencrypted_credentials = integration.old_credentials
            integration.credentials = unencrypted_credentials
            integration.save
        end
    end

    def down
        remove_column :third_party_integrations, :credentials
    end
    
end
