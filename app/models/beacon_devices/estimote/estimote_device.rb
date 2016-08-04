class EstimoteDevice < BeaconDevice

    store_accessor :device_data, :hardware_type, :hardware_revision, :firmware_version, :color, :name, :tags, :form_factor, :battery_percentage, :estimated_battery_lifetime

    after_save :update_ibeacon_configuration
    after_save :update_eddystone_uid_configuration

    class << self

        def build_from_estimote_device(estimote_device)
            attributes = {
                manufacturer_id: estimote_device.identifier.to_s,
                device_data: {
                    hardware_type: estimote_device.hardware_type,
                    hardware_revision: estimote_device.hardware_revision,
                    color: estimote_device.color,
                    form_factor: estimote_device.form_factor,
                    battery_percentage: estimote_device.battery_percentage,
                    estimated_battery_lifetime: estimote_device.estimated_battery_lifetime,
                    firmware_version: estimote_device.firmware_version,
                    name: estimote_device.name,
                    tags: estimote_device.tags
                }
            }

            if estimote_device.ibeacon_advertiser && estimote_device.ibeacon_advertiser.enabled
                ibeacon = estimote_device.ibeacon_advertiser
                attributes.merge!({ uuid: ibeacon.uuid, major: ibeacon.major, minor: ibeacon.minor })
                attributes[:device_data].merge!({ ibeacon: { name: ibeacon.name, power: ibeacon.power, interval: ibeacon.interval }})
            end

            if estimote_device.eddystone_uid_advertiser && estimote_device.eddystone_uid_advertiser.enabled
                eddystone_uid = estimote_device.eddystone_uid_advertiser
                attributes.merge!({ namespace: eddystone_uid.namespace_id , instance_id: eddystone_uid.instance_id })
                attributes[:device_data].merge!({ eddystone_uid: { name: eddystone_uid.name, power: eddystone_uid.power, interval: eddystone_uid.interval }})
            end


            EstimoteDevice.new(attributes)
        end

    end


    def ibeacon_enabled?
        return !( uuid.nil? && major.nil? && minor.nil? )
    end

    def eddystone_uid_enabled?
        return !( namespace.nil? && instance_id.nil? )
    end

    def ibeacon_settings
        device_data["ibeacon"] || {}
    end

    def eddystone_uid_settings
        device_data["eddystone_uid"] || {}
    end

    def merge_new_settings(estimote_device)
        attributes = {
            manufacturer_id: estimote_device.identifier.to_s,
            device_data: {
                hardware_type: estimote_device.hardware_type,
                hardware_revision: estimote_device.hardware_revision,
                color: estimote_device.color,
                form_factor: estimote_device.form_factor,
                battery_percentage: estimote_device.battery_percentage,
                estimated_battery_lifetime: estimote_device.estimated_battery_lifetime,
                firmware_version: estimote_device.firmware_version,
                name: estimote_device.name,
                tags: estimote_device.tags
            }
        }

        if estimote_device.ibeacon_advertiser && estimote_device.ibeacon_advertiser.enabled
            ibeacon = estimote_device.ibeacon_advertiser
            attributes.merge!({ uuid: ibeacon.uuid, major: ibeacon.major, minor: ibeacon.minor })
            attributes[:device_data].merge!({ ibeacon: { name: ibeacon.name, power: ibeacon.power, interval: ibeacon.interval }})
        end

        if estimote_device.eddystone_uid_advertiser && estimote_device.eddystone_uid_advertiser.enabled
            eddystone_uid = estimote_device.eddystone_uid_advertiser
            attributes.merge!({ namespace: eddystone_uid.namespace_id , instance_id: eddystone_uid.instance_id })
            attributes[:device_data].merge({ eddystone_uid: { name: eddystone_uid.name, power: eddystone_uid.power, interval: eddystone_uid.interval }})
        end

        attributes.each do |k,v|
            self[k] = v
        end

    end

    def needs_update?(estimote_device)

        # compare device data
        device_changes = (
            hardware_type != estimote_device.hardware_type ||
            hardware_revision != estimote_device.hardware_revision ||
            color != estimote_device.color ||
            form_factor != estimote_device.form_factor ||
            battery_percentage != estimote_device.battery_percentage ||
            estimated_battery_lifetime != estimote_device.estimated_battery_lifetime ||
            firmware_version != estimote_device.firmware_version
        )

        return true if device_changes

        # TODO:
        # Simplify using ibeacon_configuration_will_change?
        ibeacon = estimote_device.ibeacon_advertiser

        if ibeacon_enabled? != ibeacon.enabled
            return true
        elsif !(ibeacon_enabled? == false && ibeacon.enabled == false)
            # since we do not store ibeacon data when we are disbaled
            # if the ibeacon was displayed and we are as well this always returns true
            ibeacon_changed = (
                uuid != ibeacon.uuid ||
                major != ibeacon.major ||
                minor != ibeacon.minor
                ibeacon_settings["name"] != ibeacon.name ||
                ibeacon_settings["power"] != ibeacon.power ||
                ibeacon_settings["interval"] != ibeacon.interval
            )

            return true if ibeacon_changed
        end

        eddystone_uid = estimote_device.eddystone_uid_advertiser

        if eddystone_uid_enabled? != eddystone_uid.enabled?
            return true
        elsif !(eddystone_uid_enabled? == false && eddystone_uid.enabled == false)
            eddystone_uid_changed = (
                eddystone_uid_enabled? != eddystone_uid.enabled ||
                namespace != eddystone_uid.namespace_id ||
                instance_id != eddystone_uid.instance_id ||
                eddystone_uid_settings["name"] != eddystone_uid.name ||
                eddystone_uid_settings["power"] != eddystone_uid.power ||
                eddystone_uid_settings["interval"] != eddystone_uid.interval
            )

            return true if eddystone_uid_changed
        end

        return false
    end

    def ibeacon_configuration_will_change?(estimote_device)

        if ibeacon_enabled? != ibeacon.enabled
            return true
        elsif !(ibeacon_enabled? == false && ibeacon.enabled == false)
            # since we do not store ibeacon data when we are disbaled
            # if the ibeacon was displayed and we are as well this always returns true
            ibeacon_changed = (
                uuid != ibeacon.uuid ||
                major != ibeacon.major ||
                minor != ibeacon.minor
            )

            return true if ibeacon_changed
        else
            return false
        end
    end

    def eddystone_uid_configuration_will_change?(estimote_device)

        eddystone_uid = estimote_device.eddystone_uid_advertiser

        if eddystone_uid_enabled? != eddystone_uid.enabled?
            return true
        elsif !(eddystone_uid_enabled? == false && eddystone_uid.enabled == false)
            eddystone_uid_changed = (
                eddystone_uid_enabled? != eddystone_uid.enabled ||
                namespace != eddystone_uid.namespace_id ||
                instance_id != eddystone_uid.instance_id
            )
            return true if eddystone_uid_changed
        else
            return false
        end
    end

    def ibeacon_configuration_changed?
        return (
            uuid_was != uuid ||
            major_was != major ||
            minor_was != minor
        )
    end

    def eddystone_uid_configuration_changed?
        return (
            namespace_was != namespace ||
            instance_id_was != instance_id
        )
    end

    def ibeacon_configuration
        return nil if uuid.nil? || major.nil? || minor.nil?
        @ibeacon_configuration ||= IBeaconConfiguration.where(account_id: self.account_id, uuid: self.uuid, major: self.major, minor: self.minor).first
    end

    def ibeacon_configuration_was
        return nil if uuid_was.nil? || major_was.nil? || minor_was.nil?
        @ibeacon_configuration_was ||= IBeaconConfiguration.where(account_id: self.account_id, uuid: self.uuid_was, major: self.major_was, minor: self.minor_was).first
    end

    def eddystone_uid_configuration
        return nil if namespace.nil? || instance_id.nil?
        @eddystone_uid_configuration ||= EddystoneNamespaceConfiguration.where(account_id: self.account_id, namespace: namespace, instance_id: instance_id).first
    end

    def eddystone_uid_configuration_was
        return nil if namespace_was.nil? || instance_id_was.nil?
        @eddystone_uid_configuration_was ||= EddystoneNamespaceConfiguration.where(account_id: self.account_id, namespace: namespace_was, instance_id: instance_id_was)
    end

    def device_attributes
        {
            identifier: manufacturer_id.to_s,
            hardware_type: hardware_type,
            hardware_revision: hardware_revision,
            color: color,
            form_factor: form_factor,
            battery_percentage: battery_percentage,
            estimated_battery_lifetime: estimated_battery_lifetime,
            firmware_version: firmware_version,
            name: name,
            tags: tags,
            ibeacon: {
                uuid: uuid,
                major_number: major,
                minor_number: minor,

            }.merge(ibeacon_settings),
            eddystone_uid: {
                namespace: namespace,
                instance_id: instance_id
            }.merge(eddystone_uid_settings)
        }

    end

    def model_type
        return "estimote-beacons"
    end

    def manufacturer
        return "estimote"
    end

    def manufacturer_model
        return "estimote-#{self.color}"
    end

    def configuration_name
        self.name
    end

    private

    def update_ibeacon_configuration
        if ibeacon_configuration_changed?

            if ibeacon_configuration_was
                ibeacon_configuration_was.touch(:beacon_devices_updated_at)
            end

            if ibeacon_configuration
                ibeacon_configuration.touch(:beacon_devices_updated_at)
            end
        end
    end

    def update_eddystone_uid_configuration
        if eddystone_uid_configuration_changed?

            if eddystone_uid_configuration_was
                eddystone_uid_configuration_was.touch(:beacon_devices_updated_at)
            end

            if eddystone_uid_configuration
                eddystone_uid_configuration.touch(:beacon_devices_updated_at)
            end

        end
    end

end
