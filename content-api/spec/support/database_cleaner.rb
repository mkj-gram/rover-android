RSpec.configure do |config|

    config.before(:suite) do
        DatabaseCleaner.strategy = :transaction
        DatabaseCleaner.clean_with(:truncation)
        Customer.delete_all
    end

    # config.before(:suite) do |example|
    #     DatabaseCleaner.cleaning do
    #         example.run
    #     end
    #     Customer.delete_all
    # end

end
