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
        self.credentials = {app_id: app_id, app_token: app_token}
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

    def credentials_json
        {
            "app-id" => self.app_id,
            "app-token" => self.app_token
        }
    end

    def client
        @client ||= EstimoteApi.new(app_id, app_token)
    end

    def sync!

        stats = {
            added_devices_count: 0,
            modified_devices_count: 0,
            removed_devices_count: 0,
            devices_changed_configuration_count: 0
        }

        estimote_beacons = client.beacons
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
                # for now we don't want to track their url devices
                device = nil
                # device = EstimoteUrlDevice.build_from_beacon(beacon)
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
                if existing_configuration.id == new_config.id
                    stats[:devices_changed_configuration_count] += 1
                end
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

end
