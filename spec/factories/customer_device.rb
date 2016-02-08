FactoryGirl.define do
    factory :customer_device do
        udid SecureRandom.uuid
        token "123"
        locale_lang "en"
        locale_region "ca"
        sdk_version "4.0.0"
        platform "apple"
        os_name "ios"
        os_version "9.1"
        model "iphone 6plus"
        manufacturer "apple"
        carrier "rogers"
        idfa "abc"
        local_notifications_enabled true
        remote_notifications_enabled true
        bluetooth_enabled true
    end
end
