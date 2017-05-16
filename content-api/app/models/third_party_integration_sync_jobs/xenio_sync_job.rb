class XenioSyncJob < ThirdPartyIntegrationSyncJob

    store_accessor :stats, :added_zones_count, :updated_zones_count, :removed_zones_count, :added_places_count, :updated_places_count, :removed_places_count

    class << self
        def model_type
            "xenio-sync-jobs"
        end
    end


    def stats_attributes
        {
            added_zones_count: added_zones_count || 0,
            updated_zones_count: updated_zones_count || 0,
            removed_zones_count: removed_zones_count || 0,
            added_places_count: added_places_count || 0,
            updated_places_count: added_places_count || 0,
            removed_places_count: removed_places_count || 0
        }
    end

end
