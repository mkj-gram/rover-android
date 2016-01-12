require 'mailgun'
require 'bunny'
require 'mail_client'

class SendEmailWorker
    include Sneakers::Worker

    from_queue 'send_email'


    def self.perform_async(from, to, subject, text)
        msg = {from: from, to: to, subject: subject, text: text}.to_json
        RabbitMQPublisher.publish(msg, {to_queue: 'send_email'})
    end

    def work(msg)
        logger.info("Recieved msg: " + msg)
        message_params = JSON.parse(msg)
        MailClient.send(message_params)
        ack!
    end
end
