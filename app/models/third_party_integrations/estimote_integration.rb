class EstimoteIntegration < ThirdPartyIntegration


    validates :app_id, presence: true
    validates :app_token, presence: true


    def self.model_type
        @@model_type ||= "estimote-integration"
    end

    def self.model_type_pluralized
        @@model_type_pluralized ||= "estimote-integrations"
    end

    def model_type(opts = {})
        should_pluralize = opts.fetch(:pluralize, true)
        should_pluralize ? EstimoteIntegration.model_type_pluralized : EstimoteIntegration.model_type
    end

    def set_credentials(app_id, app_token)
        if !app_id.nil? && !app_token.nil?
            self.credentials = {app_id: app_id, app_token: app_token}
        end
        return
    end

    def app_id
        if self.credentials
            self.credentials[:app_id]
        else
            nil
        end
    end

    def app_token
        if self.credentials
            self.credentials[:app_token]
        else
            nil
        end
    end

    def client
        @client ||= EstimoteApi.new(app_id, app_token)
    end

    def sync!

        stats = {
            added_devices_count: 0,
            modified_devices_count: 0,
            removed_devices_count: 0
        }

        estimote_beacons = [client.beacons[0]]
        p estimote_beacons
        estimote_manufacturer_ids = Set.new
        configurations_modified = Set.new
        current_devices = self.beacon_devices.all.index_by(&:manufacturer_id)
        estimote_devices = {}
        estimote_beacons.each do |beacon|
            # map this to a device on our end
            if beacon.ibeacon?
                device = EstimoteIBeaconDevice.build_from_beacon(beacon)
            elsif beacon.eddystone_namespace?
                device = EstimoteEddystoneNamespaceDevice.build_from_beacon(beacon)
            elsif beacon.url?
                device = EstimoteUrlDevice.build_from_beacon(beacon)
            else
                Rails.logger.warn("Unknown beacon type #{beacon.protocol}")
                device = nil
            end

            next if device.nil?

            estimote_manufacturer_ids.add(device.manufacturer_id)
            device.third_party_integration_id = self.id
            device.skip_cache_update = true
            estimote_devices[device.manufacturer_id] = device
        end


        # we have 2 arrays
        # 1 is all of our devices
        # 2 is all of estimotes devices
        # which ones are new?
        new_devices = estimote_devices.select{|manufacturer_id, device| current_devices[manufacturer_id].nil? }

        existing_devices_need_update = current_devices.select{ |manufacturer_id, device| estimote_devices.include?(manufacturer_id) && device.needs_update?(estimote_devices[manufacturer_id]) }

        deleted_devices = current_devices.select{|manufacturer_id, device| !estimote_manufacturer_ids.include?(manufacturer_id)}

        # with new devices we can just create their configs and if they exist oh well
        new_devices.each do |manufacturer_id, device|
            if device.save && new_config = device.create_configuration(self.account_id)
                stats[:added_devices_count] += 1
                configurations_modified.add(new_config) if new_config != nil
            end
        end

        # existing devices need to update their previous config and update their newone
        existing_devices_need_update.each do |manufacturer_id, device|
            existing_configuration = device.configuration
            configurations_modified.add(existing_configuration) if existing_configuration != nil
            device.overwrite_attributes_with_device(estimote_devices[manufacturer_id])

            if device.save && new_config = device.create_configuration(self.account_id)
                stats[:modified_devices_count] += 1
                configurations_modified.add(new_config) if new_config != nil
            end
        end

        deleted_devices.each do |manufacturer_id, device|
            device.skip_cache_update = true
            if device.destroy
                stats[:removed_devices_count] += 1
                configurations_modified.add(device.configuration)
            end
        end
        configurations_modified.each do |configuration|
            configuration.touch(:beacon_devices_updated_at)
        end

        return stats
    end

    private


    def save_ibeacon_configuration(beacon)
        configuration = IBeaconConfiguration.where(uuid: beacon.uuid, major: beacon.major, minor: beacon.minor).first
        if configuration.nil?
            configuration = IBeaconConfiguration.new(account_id: account_id, uuid: beacon.uuid, major: beacon.major, minor: beacon.minor, title: beacon.name)
            configuration.save
        end
        return configuration
    end

    def save_eddystone_namespace_configuration(beacon)
        configuration = EddystoneNamespaceConfiguration.where(namespace: beacon.eddystone_namespace, instance_id: beacon.eddystone_instance_id).first
        if configuration.nil?
            configuration = EddystoneNamespaceConfiguration.new(account_id: account_id, namespace: beacon.eddystone_namespace, instance_id: beacon.eddystone_instance_id, title: beacon.title)
            configuration.save
        end
        return configuration
    end

    def save_url_configuration(beacon)
        # we don't autosave for now
    end

end
