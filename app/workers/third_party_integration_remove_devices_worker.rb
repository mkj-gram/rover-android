class ThirdPartyIntegrationRemoveDevicesWorker
    include Sneakers::Worker

    from_queue 'third_party_integrations_remove_devices'

    def self.perform_async(integration_id)
        msg = {id: integration_id}.to_json
        RabbitMQPublisher.publish(msg, {to_queue: 'third_party_integrations_remove_devices'})
    end

    def work(msg)
        # grab the integration and sync it
        payload = JSON.parse(msg)
        integration_id = payload["id"]

        devices = BeaconDevice.where(third_party_integration_id: integration_id).destroy_all
        configurations = devices.map{|device| device.configuration }.uniq

        configurations.each do |configuration|
            configuration.touch(:beacon_devices_updated_at)
        end

        ack!

    end
end
