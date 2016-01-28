require 'mailgun'
require 'bunny'
require 'mail_client'

class SendEmailWorker
    include BackgroundWorker::Worker

    from_queue 'send_email'


    def self.perform_async(from, to, subject, html)
        msg = {from: from, to: to, subject: subject, html: html}.to_json
        enqueue_message(msg, {to_queue: 'send_email'})
    end

    def work(msg)
        logger.info("Recieved msg: " + msg)
        message_params = JSON.parse(msg)
        MailClient.send(message_params)
        logger.info("Message sent")
        ack!
    end
end
