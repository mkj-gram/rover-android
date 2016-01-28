class SyncThirdPartyIntegrationWorker
    include BackgroundWorker::Worker

    from_queue 'third_party_integrations_sync_devices'

    def self.perform_async(sync_job_id)
        msg = {id: sync_job_id}.to_json
        enqueue_message(msg, {to_queue: 'third_party_integrations_sync_devices'})
    end

    def work(msg)
        # grab the integration and sync it
        payload = JSON.parse(msg)
        sync_job_id = payload["id"]
        sync_job = ThirdPartyIntegrationSyncJob.find_by_id(sync_job_id)

        # start the job

        if sync_job
            begin
                sync_job.start!
                sync_job.sync!
            rescue Exception => e
                # some error occured
                # sync_job.error_message = "123123123"
                sync_job.error_message = e.message
            ensure
                sync_job.finish!
            end
        end

        # finish the job


        # ack even if the integration doesn't exist
        ack!
    end
end
