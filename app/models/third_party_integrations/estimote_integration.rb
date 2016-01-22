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

        # this method syncs the integration with the account
        beacons = client.beacons

        current_devices = self.beacon_devices.all.index_by(&:manufacturer_id)
        # array of estimote devices pulled in from the api and coverted
        estimote_manufacturer_ids = Set.new
        # we need to look in the users account
        beacons.each do |beacon|
            p "looking at beacon #{beacon.mac}"
            if beacon.ibeacon?
                save_ibeacon_configuration(beacon)
                device = EstimoteIBeaconDevice.build_from_beacon(beacon)
            elsif beacon.eddystone_namespace?
                save_eddystone_namespace_configuration(beacon)
                device = EstimoteEddystoneNamespaceDevice.build_from_beacon(beacon)
            elsif beacon.url?
                save_url_configuration(beacon)
                device = EstimoteUrlDevice.build_from_beacon(beacon)
            else
                Rails.logger.warn("Unknown beacon type #{beacon.protocol}")
                device = nil
            end

            next if device.nil?


            estimote_manufacturer_ids.add(device.manufacturer_id)
            device.third_party_integration_id = self.id
            device.skip_cache_update = true

            if current_devices[device.manufacturer_id].nil?
                # this is a new device
                if device.save
                    stats[:added_devices_count] += 1
                end
            else
                # this device exists already lets see if we need to update it
                existing_device = current_devices[device.manufacturer_id]
                if existing_device.needs_update?(device)
                    existing_device.overwrite_attributes_with_device(device)
                    if existing_device.save
                        stats[:modified_devices_count] += 1
                    end

                end
            end

        end

        # check to see if any beacons don't exist
        deleted_devices = current_devices.select{|manufacturer_id, device| !estimote_manufacturer_ids.include?(manufacturer_id)}.values
        deleted_devices.each do |device|
            device.skip_cache_update = true
            if device.destroy
                stats[:removed_devices_count] += 1
            end
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
