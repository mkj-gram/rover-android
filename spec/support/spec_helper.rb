RSpec.configure do |config|
    config.include FactoryGirl::Syntax::Methods
    config.include Requests::JsonHelpers, type: :request
end
