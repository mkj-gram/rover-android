class GoogleSyncJob < ThirdPartyIntegrationSyncJob

    store_accessor :stats, :configurations_created_on_google, :configurations_modified_on_google, :configurations_created_on_rover
    # configurations_created_on_google
    # configurations_modified_on_google
    # configurations_created_on_rover
    # configurations_modified_on_rover ???


    class << self
        def model_type
            "google-sync-jobs"
        end
    end


    def stats_attributes
        {
            configurations_created_on_google: configurations_created_on_google || 0,
            configurations_modified_on_google: configurations_modified_on_google || 0,
            configurations_created_on_rover: configurations_created_on_rover || 0
        }
    end

end
