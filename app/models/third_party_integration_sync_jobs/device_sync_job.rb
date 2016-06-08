class DeviceSyncJob < ThirdPartyIntegrationSyncJob

    store_accessor :stats, :added_devices_count, :modified_devices_count, :removed_devices_count, :devices_changed_configuration_count

     class << self
        def model_type
            "device-sync-jobs"
        end
    end
end
