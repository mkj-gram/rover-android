RSpec.configure do |config|
    Mongo::Logger.logger = Rails.logger
end
