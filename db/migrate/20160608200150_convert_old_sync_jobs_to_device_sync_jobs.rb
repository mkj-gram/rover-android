class ConvertOldSyncJobsToDeviceSyncJobs < ActiveRecord::Migration

   	def up
   		ThirdPartyIntegrationSyncJob.where(type: nil).update_all(type: "DeviceSyncJob")
    end

end
