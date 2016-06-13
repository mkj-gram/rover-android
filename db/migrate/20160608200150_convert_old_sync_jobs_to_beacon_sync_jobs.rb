class ConvertOldSyncJobsToBeaconSyncJobs < ActiveRecord::Migration

    def up
        ThirdPartyIntegrationSyncJob.where(type: nil).includes(:third_party_integration).each do |sync_job|
            case sync_job.third_party_integration
            when EstimoteIntegration
                sync_job.update(type: "EstimoteSyncJob")
            when KontaktIntegration
                sync_job.update(type: "KontaktSyncJob")
            else
                sync_job.update(type: "BeaconSyncJob")
            end
        end
    end

end
