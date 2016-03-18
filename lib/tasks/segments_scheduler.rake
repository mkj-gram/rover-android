desc "This task is called by the Heroku scheduler add-on it enqueues a background worker to update all segment counts"

task :update_approximation_count => :environment do
    CustomerSegment.update_all_customer_counts_async
end
