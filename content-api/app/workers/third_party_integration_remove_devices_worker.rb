class ThirdPartyIntegrationRemoveDevicesWorker
    include BackgroundWorker::Worker

    from_queue 'third_party_integrations_remove_devices'

    def self.perform_async(integration_id)
        msg = {id: integration_id}
        enqueue_message(msg, {to_queue: 'third_party_integrations_remove_devices'})
    end

    def perform(args)
        # grab the integration and sync it
        integration_id = args["id"]

        devices = BeaconDevice.where(third_party_integration_id: integration_id).destroy_all
        configurations = devices.map{|device| device.configuration }.uniq

        configurations.each do |configuration|
            configuration.touch(:beacon_devices_updated_at)
        end

        ack!

    end
end
