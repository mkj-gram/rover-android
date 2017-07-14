if Rails.configuration.sentry["enabled"] == true
    Raven.configure do |config|
        config.dsn = 'https://70574f87cf37409b87468c61930baeb7:7993ba517b0e4615a25d68b7f44c8afe@app.getsentry.com/75722'
        config.environments = ['production']
    end
else
    Raven.configure do |config|
        config.should_capture = false
    end 
    puts "Skipping Sentry setup"
end