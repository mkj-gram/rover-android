FactoryGirl.define do
    factory :password_reset do
        user
        email { user.email }
    end
end
