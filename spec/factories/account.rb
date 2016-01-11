FactoryGirl.define do
    factory :account do
        title "Test Account"
    end

    factory :different_account, class: Account do
        title "Malicious Account"
    end
end
