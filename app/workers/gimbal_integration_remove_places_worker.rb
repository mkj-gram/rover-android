class GimbalIntegrationRemovePlacesWorker
    include BackgroundWorker::Worker

    from_queue 'gimbal_integration_remove_places_worker'

    def self.perform_async(gimbal_integration_id)
        account_id = gimbal_integration_id.is_a?(GimbalIntegration) ? gimbal_integration_id.account_id : GimbalIntegration.find(gimbal_integration_id).account_id
        msg = {account_id: account_id}
        enqueue_message(msg, {to_queue: 'gimbal_integration_remove_places_worker'})
    end

    def perform(args)
        # grab the integration and sync it
        account_id = args["account_id"]
        bulk = []

        GimbalPlace.where(account_id: account_id).find_in_batches(batch_size: 500) do |gimbal_places|
            gimbal_places.each do |gimbal_place|
                bulk.push({
                    delete: { _index: GimbalPlace.index_name, _type: GimbalPlace.document_type, _id: gimbal_place.id }
                })
            end
        end

        begin
            Sneakers.looger.info("Removing #{bulk.size} gimbal places from Elasticsearch")
            Elasticsearch::Model.client.bulk(body: bulk) if bulk.any?
            GimbalPlace.where(account_id: account_id).update_all(searchable: false)
            return ack!
        rescue Exception => e
            Raven.capture_exception(exception)
            Sneakers.logger.warn(e)
            return reject!
        end

    end
end
