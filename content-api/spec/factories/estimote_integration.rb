FactoryGirl.define do
    factory :estimote_integration do
        account
        credentials { {app_id: "test", app_token: "test" }}
    end
end
