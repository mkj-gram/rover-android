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

end
