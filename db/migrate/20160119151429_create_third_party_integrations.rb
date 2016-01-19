class CreateThirdPartyIntegrations < ActiveRecord::Migration
    def change
        create_table :third_party_integrations do |t|
            t.integer :account_id, null: false
            t.string :type, null: false
            t.boolean :syncing, default: false
            t.string :encrypted_credentials
            t.string :encrypted_credentials_salt
            t.string :encrypted_credentials_iv
            t.timestamps null: false
        end

        add_index :third_party_integrations, :account_id
        add_index :third_party_integrations, [:account_id, :type]
    end
end
