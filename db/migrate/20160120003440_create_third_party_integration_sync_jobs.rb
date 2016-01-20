class CreateThirdPartyIntegrationSyncJobs < ActiveRecord::Migration
    def change
        create_table :third_party_integration_sync_jobs do |t|
            t.integer :third_party_integration_id, null: false
            t.integer :status, default: 0
            t.datetime :started_at
            t.datetime :finished_at
            t.text :error_message
            t.timestamps null: false
        end

        add_index :third_party_integration_sync_jobs, :third_party_integration_id, name: "integration_sync_job_integration_id_index"
    end
end
