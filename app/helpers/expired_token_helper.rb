module ExpiredTokenHelper

    class << self

        def expire_devices(devices)
            devices.each do |device|
                device.update_attributes({token: nil, remote_notifications_enabled: false})
            end
        end
    end

end
