class GimbalIntegrationRemovePlacesWorker
    include BackgroundWorker::Worker

    from_queue 'gimbal_integration_remove_places_worker'

    def self.perform_async(gimbal_integration_id)
        msg = {id: gimbal_integration_id}
        enqueue_message(msg, {to_queue: 'gimbal_integration_remove_places_worker'})
    end

    def perform(args)
        # grab the integration and sync it
        integration_id = args["id"]

        GimbalPlace.where(gimbal_integration_id: integration_id).destroy_all
        
        ack!

    end
end
