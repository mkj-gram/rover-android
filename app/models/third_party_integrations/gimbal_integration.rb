class GimbalIntegration < ThirdPartyIntegration

    validates :api_key, presence: true


    def self.model_type
        @@model_type ||= "gimbal-integration"
    end

    def self.model_type_pluralized
        @@model_type_pluralized ||= "gimbal-integrations"
    end

    def model_type(opts = {})
        should_pluralize = opts.fetch(:pluralize, true)
        should_pluralize ? GimbalIntegration.model_type_pluralized : GimbalIntegration.model_type
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
            "api-key" => self.api_key,
        }
    end

    def client
        @client ||= GimbalApi.new(api_key)
    end

    def sync!

        stats = {
            added_devices_count: 0,
            modified_devices_count: 0,
            removed_devices_count: 0,
            devices_changed_configuration_count: 0
        }

        # grab all the places
        api_places_index = client.places.index_by(&:id)

        api_place_ids = api_places_index.keys

        gimbal_places = GimbalPlace.where(id: api_place_ids).all

        new_api_places = (api_place_ids - gimbal_places.map(&:id)).collect{|id| api_places_index[id] }

        new_gimbal_places = new_api_places.map{|api_place| GimbalPlace.new(account_id: self.account_id, id: api_place.id, name: api_place.name )}

        old_gimbal_places = gimbal_places.select{|gimbal_place| api_places_index[gimbal_place.id].nil? }

        new_gimbal_places.each do |gimbal_place|
            if gimbal_place.save
                added_devices_count += 1
            end
        end

        old_gimbal_places.each do |gimbal_place|
            if gimbal_place.destroy
                removed_devices_count += 1
            end
        end

        return stats
    end

end
