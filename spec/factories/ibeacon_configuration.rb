FactoryGirl.define do
    factory :ibeacon_configuration, class: "IBeaconConfiguration" do
        account
        title   { Faker::Commerce.product_name }
        tags    { ["always", "three", "tags"] }
        uuid    { SecureRandom.uuid.upcase }
        major   { rand(5000) }
        minor   { rand(5000) }
    end
end
