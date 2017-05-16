class AddOrderIndexesToThirdPartyIntegrationsSyncJobs < ActiveRecord::Migration
    def change
        # order by created_at, started_at, finished_at
        add_index :third_party_integration_sync_jobs, :created_at, name: "integration_sync_job_integration_created_at_index", order: {created_at: "DESC NULLS LAST"}
        add_index :third_party_integration_sync_jobs, :started_at, name: "integration_sync_job_integration_started_at_index", order: {started_at: "DESC NULLS LAST"}
        add_index :third_party_integration_sync_jobs, :finished_at, name: "integration_sync_job_integration_finished_at_index", order: {finished_at: "DESC NULLS LAST"}
    end
end
