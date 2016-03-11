FactoryGirl.define do
    factory :customer do
        account
        name "Chris Recalis"
        email "chris@rover.io"
        phone_number "(555) 555-5555"
        tags ["hellafresh", "hashtagWHAT"]
        traits { {"gold_plus" => true, "interests" => ["volleyball","pie-eating"]}} # who doesn't love pie (phil)
    end
end
