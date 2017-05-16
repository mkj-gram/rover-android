class SyncThirdPartyIntegrationWorker
    include BackgroundWorker::Worker

    from_queue 'third_party_integrations_sync_devices'

    def self.perform_async(sync_job_id)
        msg = {id: sync_job_id}
        enqueue_message(msg, {to_queue: 'third_party_integrations_sync_devices'})
    end

    def perform(args)
        # grab the integration and sync it
        sync_job_id = args["id"]
        sync_job = ThirdPartyIntegrationSyncJob.find_by_id(sync_job_id)

        # start the job

        if sync_job
            begin
                Rails.logger.info("Starting sync job for #{sync_job.id}")
                sync_job.start!
                Rails.logger.info("Syncing #{sync_job.id}")
                sync_job.sync!
            rescue Exception => e
                # some error occured
                # sync_job.error_message = "123123123"
                Rails.logger.warn(e)
                sync_job.error_message = e.message
                Raven.user_context(account_id: sync_job.third_party_integration.account_id, integration_id: sync_job.third_party_integration.id)
                Raven.tags_context(sync_job_type: sync_job.type, integration_type: sync_job.third_party_integration.type)
                Raven.capture_exception(e)
            ensure
                sync_job.finish!
            end
        end

        # finish the job


        # ack even if the integration doesn't exist
        ack!
    end
end
