class XenioIntegration < ThirdPartyIntegration

    validates :api_key, presence: true
    validates :customer_id, presence: true
    validates :account_id, presence: true

    after_commit :create_sync_job!, on: :create
    after_destroy :remove_xenio_zones
    after_destroy :remove_xenio_places

    has_many :sync_jobs, class_name: "XenioSyncJob", foreign_key:  "third_party_integration_id" do

        def latest
            last
        end

        def previous
            last(2).last
        end
    end

    has_many :xenio_zones, foreign_key: "xenio_integration_id"
    has_many :xenio_places, foreign_key: "xenio_integration_id"

    def self.model_type
        @@model_type ||= "xenio-integration"
    end

    def self.model_type_pluralized
        @@model_type_pluralized ||= "xenio-integrations"
    end

    def model_type(opts = {})
        should_pluralize = opts.fetch(:pluralize, true)
        should_pluralize ? XenioIntegration.model_type_pluralized : XenioIntegration.model_type
    end

    def set_credentials(api_key, customer_id)
        self.credentials = { api_key: api_key, customer_id: customer_id }
    end

    def api_key
        if self.credentials
            self.credentials[:api_key]
        else
            nil
        end
    end

    def api_key=(new_key)
        set_credentials(new_key, customer_id)
    end

    def customer_id
        if self.credentials
            self.credentials[:customer_id]
        else
            nil
        end
    end

    def customer_id=(new_customer_id)
        set_credentials(api_key, new_customer_id)
    end

    def credentials_json
        {
            "api-key" => api_key,
            "customer-id" => customer_id
        }
    end

    def client
        @client ||= XenioApi.new(api_key, customer_id)
    end


    def sync!(calling_job)


        stats = {
            added_zones_count: 0,
            updated_zones_count: 0,
            removed_zones_count: 0,
            added_places_count: 0,
            updated_places_count: 0,
            removed_places_count: 0
        }

        ############################# 
        #        Xenio Zones        #
        ############################# 

        zones = client.zones
        current_zones = XenioZone.where(id: zones.map(&:id), account_id: self.account_id).all

        indexed_current_zones = current_zones.index_by(&:id)
        indexed_zones = zones.index_by(&:id)

        # zones that need to be saved
        new_zones = zones.select{|zone| indexed_current_zones[zone.id].nil? }.map{|zone| XenioZone.new(id: zone.id, name: zone.name, tags: zone.tags, place_id: zone.place_id, account_id: self.account_id, xenio_integration_id: self.id) }

        # zones which have to update their configuration
        updated_zones = (current_zones.map do |current_zone|
                             matched_zone = indexed_zones[current_zone.id]
                             current_zone.name = matched_zone.name
                             current_zone.tags = matched_zone.tags
                             current_zone.place_id = matched_zone.place_id
                             current_zone
        end).delete_if{|current_zone| !current_zone.changed? }

        # zones which no longer exists
        deleted_ids = Set.new(indexed_current_zones.keys - indexed_zones.keys)

        deleted_zones = current_zones.select{ |current_zone| deleted_ids.include?(current_zone.id) }


        new_zones.each(&:save)
        updated_zones.each(&:save)
        deleted_zones.each(&:destroy)

        stats[:added_zones_count] = new_zones.size
        stats[:updated_zones_count] = updated_zones.size
        stats[:deleted_zones_count] = deleted_zones.size


        ############################# 
        #       Xenio Places        #
        ############################# 

        places = client.places
        current_places = XenioPlace.where(id: places.map(&:id), account_id: self.account_id).all

        indexed_current_places = current_places.index_by(&:id)
        indexed_places = places.index_by(&:id)

        # places that need to be saved
        new_places = places.select{|place| indexed_current_places[place.id].nil? }.map{|place| XenioPlace.new(id: place.id, name: place.name, tags: place.tags, account_id: self.account_id, xenio_integration_id: self.id) }

        # places which have to update their configuration
        updated_places = (current_places.map do |current_place|
            matched_place = indexed_places[current_place.id]
            current_place.name = matched_place.name
            current_place.tags = matched_place.tags
            current_place
        end).delete_if{|current_place| !current_place.changed? }

        # places which no longer exists
        deleted_ids = Set.new(indexed_current_places.keys - indexed_places.keys)

        deleted_places = current_places.select{ |current_place| deleted_ids.include?(current_place.id) }


        new_places.each(&:save)
        updated_places.each(&:save)
        deleted_places.each(&:destroy)

        stats[:added_places_count] = new_places.size
        stats[:updated_places_count] = updated_places.size
        stats[:deleted_places_count] = deleted_places.size


        return stats
    end


    private

    def remove_xenio_zones
        xenio_zones.destroy_all
    end

    def remove_xenio_places
        xenio_places.destroy_all
    end
end
