class ConvertOldSyncJobsToBeaconSyncJobs < ActiveRecord::Migration

   	def up
   		ThirdPartyIntegrationSyncJob.where(type: nil).update_all(type: "BeaconSyncJob")
    end

end
