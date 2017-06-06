FactoryGirl.define do
    factory :account do
        title "Test Account"
        token "token"
    end

    factory :different_account, class: Account do
        title "Malicious Account"
    end
end
