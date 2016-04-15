require 'colorize'
namespace :scheduled_messages do
    desc "Send out any scheduled messages that need to be sent"
    task :send => :environment do
        Rails.logger.info("Queueing scheduled messages".red)
        scheduled_time = Time.now + 24.hours
        messaged_enqueued = 0
        approximate_total_customers_count = 0
        ScheduledMessage.where(published: true, sent: false).where("scheduled_at < ?", scheduled_time).find_each do |scheduled_message|
            scheduled_message.update_attributes({sent: true})
            SendMessageWorker.perform_async(scheduled_message.account, scheduled_message)
            messaged_enqueued += 1
            approximate_total_customers_count += scheduled_message.approximate_customers_count
        end
        Rails.logger.info("Done! queued #{messaged_enqueued} messages for delivery, sending out #{approximate_total_customers_count.to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse} notifications".green)
    end
end
