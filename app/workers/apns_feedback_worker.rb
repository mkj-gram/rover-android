require 'expired_token_helper'

class ApnsFeedbackWorker
    include BackgroundWorker::Worker

    from_queue 'apns_feedback'


    def self.perform_async(apns_app)
        apns_app_id = apns_app.is_a?(ApnsApp) ? apns_app.id : apns_app
        msg = {apns_app_id: apns_app_id}.to_json
        enqueue_message(msg, {to_queue: 'apns_feedback'})
    end

    def work(msg)
        # grab the apns app and retrive old devices
        #
        expired_devices = []
        ExpiredTokenHelper.expire_devices(expired_devices)
        ack!
    end
end
