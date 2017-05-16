class AddSyncJobsCountToThirdPartyIntegrations < ActiveRecord::Migration
    def change
        add_column :third_party_integrations, :third_party_integration_sync_jobs_count, :integer, default: 0
    end
end
