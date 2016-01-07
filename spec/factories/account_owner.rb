FactoryGirl.define do
    factory :account_owner, class: User do
        name "Rover Test"
        email "test@rover.io"
        password "123"
        password_confirmation "123"
    end
end
