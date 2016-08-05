class UpgradeEsimoteV1DevicesToV2Devices < ActiveRecord::Migration

    def up
        EstimoteDevice.find_each(batch_size: 5000) do |estimote_device|
            # how do we determine if this is an old estimote_device?
            # old device data has these properties
            #  store_accessor :device_data, :color, :name, :battery, :interval, :firmware, :range, :power, :mac, :battery_life_expectancy_in_days
            # new
            #  store_accessor :device_data, :hardware_type, :hardware_revision, :firmware_version, :color, :name, :tags, :form_factor, :battery_percentage, :estimated_battery_lifetime
            #
            if estimote_device.device_data.has_key?(:battery) ||  estimote_device.device_data.has_key?(:interval) ||  estimote_device.device_data.has_key?(:mac)
                # this is def an old one lets restructure it
                old_device_data = estimote_device.device_data.with_indifferent_access

                device_data = {
                    color: old_device_data[:color],
                    firmware_version: old_device_data[:firmware],
                    estimated_battery_lifetime: old_device_data[:battery_life_expectancy_in_days],
                    battery_percentage: old_device_data[:battery],
                    name: old_device_data[:name],
                    tags: []
                }

                signal_settings = {
                    name: old_device_data[:name],
                    power: old_device_data[:power],
                    interval: old_device_data[:interval]
                }

                if estimote_device.ibeacon_enabled?
                    device_data.merge!(ibeacon: signal_settings)
                elsif estimote_device.eddystone_uid_enabled?
                    device_data.merge!(eddystone_uid: signal_settings)
                end

                estimote_device.update_attribute(:device_data, device_data)
            end
        end
    end

    def down
        EstimoteDevice.find_each(batch_size: 5000) do |estimote_device|

            if estimote_device.device_data.has_key?(:battery_percentage) || estimote_device.device_data.has_key?(:estimated_battery_lifetime) ||  estimote_device.device_data.has_key?(:firmware_version)
                old_device_data = estimote_device.device_data.with_indifferent_access

                device_data = {
                    color: old_device_data[:color],
                    firmware: old_device_data[:firmware_version],
                    battery: old_device_data[:battery_percentage],
                    battery_life_expectancy_in_days: old_device_data[:estimated_battery_lifetime],
                    name: old_device_data[:name],
                    mac: estimote_device.manufacturer_id
                }

                if estimote_device.ibeacon_enabled?
                    attribute_name = :ibeacon
                elsif estimote_device.eddystone_uid_enabled?
                    attribute_name = :eddystone_uid
                end

                if attribute_name
                    device_data.merge!(
                        {
                            power: old_device_data.dig(attribute_name, :power),
                            interval: old_device_data.dig(attribute_name, :interval)
                        }
                    )
                end

                estimote_device.update_attribute(:device_data, device_data)

            end

        end
    end

end
