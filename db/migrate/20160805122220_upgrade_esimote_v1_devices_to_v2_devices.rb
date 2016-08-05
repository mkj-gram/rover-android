class UpgradeEsimoteV1DevicesToV2Devices < ActiveRecord::Migration

    def up
        # Disable inheritance to keep rails from complaining during the migration
        BeaconDevice.inheritance_column = :_type_disabled
        BeaconDevice.where(type: ['EstimoteDevice', 'EstimoteIBeaconDevice', 'EstimoteEddystoneNamespaceDevice']).find_each(batch_size: 5000) do |estimote_device|

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

                if estimote_device.uuid && estimote_device.major && estimote_device.minor
                    device_data.merge!(ibeacon: signal_settings)
                elsif estimote_device.namespace && estimote_device.instance_id
                    device_data.merge!(eddystone_uid: signal_settings)
                end
            end


            if device_data
                estimote_device.update_attributes(type: 'EstimoteDevice', device_data: device_data)
            else
                estimote_device.update_attributes(type: 'EstimoteDevice')
            end

        end
    end

    def down
        BeaconDevice.inheritance_column = :_type_disabled
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

                if estimote_device.uuid && estimote_device.major && estimote_device.minor
                    attribute_name = :ibeacon
                    model_name = 'EstimoteIBeaconDevice'
                elsif estimote_device.namespace && estimote_device.instance_id
                    attribute_name = :eddystone_uid
                    model_name = 'EstimoteEddystoneNamespaceDevice'
                end

                if attribute_name
                    device_data.merge!(
                        {
                            power: old_device_data.dig(attribute_name, :power),
                            interval: old_device_data.dig(attribute_name, :interval)
                        }
                    )
                end

            end

            if device_data
                estimote_device.update_attributes(type: model_name, device_data: device_data)
            else
                estimote_device.update_attributes(type: model_name)
            end

        end
    end

end
