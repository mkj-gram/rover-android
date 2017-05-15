FactoryGirl.define do
    factory :user do
        name "Randall Ward Jr."
        email "test@rover.io"
        password "123456"
        password_confirmation "123456"

        association :account, factory: :account
    end

    factory :different_user, class: User do
        name "Randall Ward Jr."
        email "test2@rover.io"
        password "123456"
        password_confirmation "123456"

        association :account, factory: :account
    end
end
