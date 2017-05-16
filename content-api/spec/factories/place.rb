FactoryGirl.define do
    factory :place do
        account
        title Faker::Company.name
        address Faker::Address.street_address
        city Faker::Address.city
        province Faker::Address.state
        country Faker::Address.country
        longitude Faker::Address.longitude
        latitude Faker::Address.latitude
        tags { Faker::Hipster.words(rand(5), true, true) }
    end
end
