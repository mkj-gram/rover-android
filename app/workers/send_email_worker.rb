require 'mailgun'
require 'bunny'
require 'mail_client'

class SendEmailWorker
    include BackgroundWorker::Worker

    from_queue 'send_email'


    def self.perform_async(from, to, subject, html)
        msg = {from: from, to: to, subject: subject, html: html}
        enqueue_message(msg, {to_queue: 'send_email'})
    end

    def perform(args)
        logger.info("Recieved msg: " + msg)
        MailClient.send(args)
        logger.info("Message sent")
        ack!
    end

end
