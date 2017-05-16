class BeaconSyncJob < ThirdPartyIntegrationSyncJob

    store_accessor :stats, :added_beacons_count, :modified_beacons_count, :removed_beacons_count, :beacons_changed_configuration_count

    class << self
        def model_type
            "beacon-sync-jobs"
        end
    end


    def stats_attributes
    	{
    		added_beacons_count: added_beacons_count || 0,
    		modified_beacons_count: modified_beacons_count || 0,
    		removed_beacons_count: removed_beacons_count || 0,
    		beacons_changed_configuration_count: beacons_changed_configuration_count || 0
    	}
    end
end
