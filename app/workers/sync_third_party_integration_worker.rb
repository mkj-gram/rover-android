class SyncThirdPartyIntegrationWorker
    include Sneakers::Worker

    from_queue 'sync_third_party_integrations'

    def self.perform_async(sync_job_id)
        msg = {id: sync_job_id}.to_json
        RabbitMQPublisher.publish(msg, {to_queue: 'sync_third_party_integrations'})
    end

    def work(msg)
        # grab the integration and sync it
        payload = JSON.parse(msg)
        sync_job_id = payload["id"]
        sync_job = ThirdPartyIntegrationSyncJob.find_by_id(sync_job_id)

        # start the job
        sync_job.start!

        integration = sync_job.third_party_integration

        if integration
            integration.sync!
        end

        # finish the job
        sync_job.finish!

        # ack even if the integration doesn't exist
        ack!
    end

end
