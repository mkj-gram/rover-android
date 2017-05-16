class AddGoogleProjectIdToThirdPartyIntegrations < ActiveRecord::Migration
    def change
        add_column :third_party_integrations, :google_project_id, :string

        add_index :third_party_integrations, :google_project_id, unique: true
    end
end
