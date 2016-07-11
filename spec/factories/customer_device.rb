FactoryGirl.define do
    factory :customer_device do
        udid { SecureRandom.uuid.upcase }
        token "123"
        locale_lang "en"
        locale_region "ca"
        sdk_version "4.0.0"
        platform "iOS"
        os_name "iOS"
        os_version "9.1"
        model "iphone 6plus"
        manufacturer "apple"
        carrier "rogers"
        idfa "abc"
        notifications_enabled true
        bluetooth_enabled true
    end
end
