FactoryGirl.define do
    factory :session do
        user
        account { user.account }
    end
end
