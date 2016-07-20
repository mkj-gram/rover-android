class GimbalIntegration < ThirdPartyIntegration

    validates :api_key, presence: true

    alias_attribute :api_key, :credentials

    # after_destroy :remove_old_gimbal_places
     
    has_many :sync_jobs, class_name: "GimbalSyncJob", foreign_key:  "third_party_integration_id" do
        def latest
            last
        end
    end


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
            added_places_count: 0,
            removed_places_count: 0,
            modified_places_count: 0
        }

        current_page = 1
        total_pages = Float::INFINITY
        # grab all the places
        while current_page <= total_pages do

            response = client.places(true, { per_page: 50, page: current_page })

            current_page += 1
            total_pages = Integer(response[:headers]["total-pages"] || 0) # guard if the pages aren't in the response and we inifinite loop
          

            api_places_index = response[:places].index_by(&:id)

            api_place_ids = api_places_index.keys

            gimbal_places = GimbalPlace.where(account_id: self.account_id, id: api_place_ids).all

            new_api_places = (api_place_ids - gimbal_places.map(&:id)).collect{|id| api_places_index[id] }

            new_gimbal_places = new_api_places.map{|api_place| GimbalPlace.new(account_id: self.account_id, id: api_place.id, name: api_place.name )}

            old_gimbal_places = gimbal_places.select{|gimbal_place| api_places_index[gimbal_place.id].nil? }

            modified_gimbal_places = gimbal_places.select do |gimbal_place|
                api_places_index[gimbal_place.id] && api_places_index[gimbal_place.id].name != gimbal_place.name 
            end
            

            new_gimbal_places.each do |gimbal_place|
                if gimbal_place.save
                    stats[:added_places_count] += 1
                end
            end

            # TODO 
            # figure out a way to find places which no longer exist on gimbals system
            old_gimbal_places.each do |gimbal_place|
                if gimbal_place.destroy
                    stats[:removed_places_count] += 1
                end
            end

            modified_gimbal_places.each do |gimbal_place|
                if gimbal_place.update_attribute(:name, api_places_index[gimbal_place.id].name)
                    stats[:modified_places_count] += 1
                end
            end
        end

        return stats
    end

end
