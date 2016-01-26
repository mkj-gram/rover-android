RSpec.configure do |config|

    config.before(:suite) do
        DatabaseCleaner.strategy = :truncation, {reset_ids: true}
        DatabaseCleaner.clean_with(:truncation)
    end

    config.around(:each) do |example|
        DatabaseCleaner.cleaning do
            example.run
        end
    end

end
