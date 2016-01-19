class SyncThirdPartyIntegrationWorker
    include Sneakers::Worker

    from_queue 'sync_third_party_integrations'

    def work(msg)
        # grab the integration and sync it
        payload = JSON.parse(msg)
        integration_id = payload["id"]
        integration = ThirdPartyIntegration.find_by_id(integration_id)
        if integration
            integration.sync!
        end
        # ack even if the integration doesn't exist
        ack!
    end
end
