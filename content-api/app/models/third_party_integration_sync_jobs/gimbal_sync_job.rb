class GimbalSyncJob < ThirdPartyIntegrationSyncJob

    store_accessor :stats, :added_places_count, :removed_places_count, :modified_places_count

    class << self
        def model_type
            "gimbal-sync-jobs"
        end
    end


    def stats_attributes
        {
            added_places_count: added_places_count || 0,
            removed_places_count: removed_places_count || 0,
            modified_places_count: modified_places_count || 0
        }
    end
end
