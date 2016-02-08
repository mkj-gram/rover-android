class UpdateCustomerDeviceAttributesWorker
    include BackgroundWorker::Worker

    from_queue 'update_device_attributes'

    def self.perform_async(device_id, new_attributes)
        updated_attributes = ActionController::Parameters.new(new_attributes).permit(:token, :locale_lang, :locale_region, :time_zone, :sdk_version, :platform, :os_name, :os_version, :model, :manufacturer, :carrier, :idfa, :aaid)
        msg = {id: device_id, attributes: updated_attributes}.to_json
        enqueue_message(msg, {to_queue: 'update_device_attributes'})
    end

    def work(msg)
        payload = JSON.parse(msg)
        device_id = payload["id"]
        attributes = payload["attributes"]
        device = CustomerDevice.lock.find_by_id(device_id)
        if device
            device.update_attributes(attributes)
        end
        ack!
    end
end
