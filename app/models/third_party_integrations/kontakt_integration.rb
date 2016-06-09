class KontaktIntegration < ThirdPartyIntegration

    validates :api_key, presence: true

    has_many :sync_jobs, class_name: "DeviceSyncJob", foreign_key:  "third_party_integration_id" do
        def latest
            last
        end
    end

    def self.model_type
        @@model_type ||= "kontakt-integration"
    end

    def self.model_type_pluralized
        @@model_type_pluralized ||= "kontakt-integrations"
    end

    def model_type(opts = {})
        should_pluralize = opts.fetch(:pluralize, true)
        should_pluralize ? KontaktIntegration.model_type_pluralized : KontaktIntegration.model_type
    end

    def set_credentials(api_key)
        self.credentials = {api_key: api_key}
    end

    def api_key
        if self.credentials
            self.credentials[:api_key]
        else
            nil
        end
    end

    def credentials_json
        {
            "api-key" => self.api_key
        }
    end

    def client
        @client ||= KontaktApi.new(api_key)
    end

    def sync!(calling_job = nil)
        stats = {
            added_beacons_count: 0,
            modified_beacons_count: 0,
            removed_beacons_count: 0,
            beacons_changed_configuration_count: 0
        }

        kontakt_server_devices = client.devices
        kontakt_server_manufacturer_ids = Set.new
        configurations_modified = Set.new
        current_devices = self.beacon_devices.all.index_by(&:manufacturer_id)
        # represents all devices seen on kontakts servers
        kontakt_server_converted_devices_index = {}
        kontakt_server_devices.each do |kontakt_server_device|
            # map this to a device on our end
            if kontakt_server_device.ibeacon?
                device = KontaktIBeaconDevice.build_from_beacon(kontakt_server_device)
            elsif kontakt_server_device.eddystone_namespace?
                device = KontaktEddystoneNamespaceDevice.build_from_beacon(kontakt_server_device)
            elsif kontakt_server_device.url?
                # for now we don't want to track their url devices
                device = nil
                # device = EstimoteUrlDevice.build_from_beacon(beacon)
            else
                Rails.logger.warn("Unknown beacon type #{kontakt_server_device.device_type}")
                device = nil
            end

            next if device.nil?

            device.account_id = self.account_id
            device.third_party_integration_id = self.id
            device.skip_cache_update = true
            kontakt_server_converted_devices_index[device.manufacturer_id] = device
        end


        new_devices = kontakt_server_converted_devices_index.select{|manufacturer_id, device| current_devices[manufacturer_id].nil? }

        existing_devices_need_update = current_devices.select{ |manufacturer_id, device| kontakt_server_converted_devices_index.include?(manufacturer_id) && device.needs_update?(kontakt_server_converted_devices_index[manufacturer_id]) }

        deleted_devices = current_devices.select{|manufacturer_id, device| !kontakt_server_converted_devices_index.include?(manufacturer_id)}

        # with new devices we can just create their configs and if they exist oh well
        new_devices.each do |manufacturer_id, device|
            if device.save && new_config = device.create_configuration
                stats[:added_beacons_count] += 1
                configurations_modified.add(new_config) if new_config != nil
            end
        end

        # existing devices need to update their previous config and update their newone
        existing_devices_need_update.each do |manufacturer_id, device|
            existing_configuration = device.configuration
            if existing_configuration.nil?
                existing_configuration = device.create_configuration
            end
            configurations_modified.add(existing_configuration) if existing_configuration != nil
            device.overwrite_attributes_with_device(kontakt_server_converted_devices_index[manufacturer_id])

            if device.save && new_config = device.create_configuration
                if (existing_configuration && new_config) && (existing_configuration.id != new_config.id)
                    stats[:beacons_changed_configuration_count] += 1
                else
                    stats[:modified_beacons_count] += 1
                end
                configurations_modified.add(new_config) if new_config != nil
            end
        end

        deleted_devices.each do |manufacturer_id, device|
            device.skip_cache_update = true
            if device.destroy
                stats[:removed_beacons_count] += 1
                configurations_modified.add(device.configuration)
            end
        end
        configurations_modified.each do |configuration|
            configuration.touch(:beacon_devices_updated_at)
        end

        return stats
    end
end
