require 'colorize'
namespace :apns do
    desc "Enqueue workers to perform feedback from apple"
    task :feedback => :environment do
        # grab all apns apps
        ApnsApp.find_each(batch_size: 1000) do |apns_app|
            ApnsFeedbackWorker.perform_async(apns_app)
        end
    end
end
