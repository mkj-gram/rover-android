class DeviceSyncJob < ThirdPartyIntegrationSyncJob

    store_accessor :stats, :added_devices_count, :modified_devices_count, :removed_devices_count, :devices_changed_configuration_count

    class << self
        def model_type
            "device-sync-jobs"
        end
    end


    def stats_attributes
    	{
    		added_devices_count: added_devices_count || 0,
    		modified_devices_count: modified_devices_count || 0,
    		removed_devices_count: removed_devices_count || 0,
    		devices_changed_configuration_count: devices_changed_configuration_count || 0
    	}
    end
end
