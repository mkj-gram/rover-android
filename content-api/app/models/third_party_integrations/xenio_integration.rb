class XenioIntegration < ThirdPartyIntegration

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

    def set_credentials(customer_id)
        self.credentials = { customer_id: customer_id }
    end

    def customer_id
        if self.credentials
            self.credentials[:customer_id]
        else
            nil
        end
    end

    def customer_id=(new_id)
        set_credentials(new_id)
    end

    def credentials_json
        {
            "customer-id" => customer_id
        }
    end

    def client
        @client ||= XenioApi.new(customer_id)
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
        zone_tags = Set.new()

        zones = client.zones
        # Auto add zone name to tags
        zones.each{|zone| zone.tags = ((zone.tags || []) + [ zone.name ]).uniq }

        current_zones = XenioZone.where(xenio_id: zones.map(&:id), account_id: self.account_id).all

        indexed_current_zones = current_zones.index_by(&:xenio_id)
        indexed_zones = zones.index_by(&:id)

        # zones that need to be saved
        new_zones = zones.select{|zone| indexed_current_zones[zone.id].nil? }.map{|zone| XenioZone.new(xenio_id: zone.id, name: zone.name, tags: zone.tags, place_id: zone.place_id, account_id: self.account_id, xenio_integration_id: self.id) }

        # zones which have to update their configuration
        updated_zones = (current_zones.map do |current_zone|
                             matched_zone = indexed_zones[current_zone.xenio_id]
                             current_zone.name = matched_zone.name
                             current_zone.tags = matched_zone.tags
                             current_zone.place_id = matched_zone.place_id
                             current_zone
        end).select{|zone| zone.changes.any? }

        deleted_zones = XenioZone.where(account_id: self.account_id).where.not(xenio_id: zones.map(&:id))


        new_zones.each(&:save)
        updated_zones.each(&:save)
        deleted_zones.each(&:destroy)

        new_zones.each {|zone| zone.tags.each{ |tag| zone_tags.add(tag) } }
        updated_zones.each {|zone| zone.tags.each { |tag| zone_tags.add(tag) } }
        (current_zones  - updated_zones).each{|zone| zone.tags.each { |tag| zone_tags.add(tag) } }

        if self.account.xenio_zone_active_tag
            self.account.xenio_zone_active_tag.update(tags: zone_tags.to_a)
        end

        stats[:added_zones_count] = new_zones.size
        stats[:updated_zones_count] = updated_zones.size
        stats[:deleted_zones_count] = deleted_zones.size


        ############################# 
        #       Xenio Places        #
        ############################# 

        place_tags = Set.new

        places = client.places
        # Auto add place name to set of tags
        places.each{|place| place.tags = ((place.tags || []) + [place.name]).uniq }

        current_places = XenioPlace.where(xenio_id: places.map(&:id), account_id: self.account_id).all

        indexed_current_places = current_places.index_by(&:xenio_id)
        indexed_places = places.index_by(&:id)

        # places that need to be saved
        new_places = places.select{|place| indexed_current_places[place.id].nil? }.map{|place| XenioPlace.new(xenio_id: place.id, name: place.name, tags: place.tags, account_id: self.account_id, xenio_integration_id: self.id) }

        # places which have to update their configuration
        updated_places = (current_places.map do |current_place|
            matched_place = indexed_places[current_place.xenio_id]
            current_place.name = matched_place.name
            current_place.tags = matched_place.tags
            current_place
        end).select{|place| place.changes.any? }

        deleted_places = XenioPlace.where(account_id: self.account_id).where.not(xenio_id: places.map(&:id))

        new_places.each(&:save)
        updated_places.each(&:save)
        deleted_places.each(&:destroy)


        new_places.each {|place| place.tags.each{ |tag| place_tags.add(tag) } }
        updated_places.each {|place| place.tags.each { |tag| place_tags.add(tag) } }
        (current_places - updated_places).each {|place| place.tags.each { |tag| place_tags.add(tag) } }

        if self.account.xenio_place_active_tag
            self.account.xenio_place_active_tag.update(tags: place_tags.to_a)
        end


        stats[:added_places_count] = new_places.size
        stats[:updated_places_count] = updated_places.size
        stats[:deleted_places_count] = deleted_places.size


        return stats
    end


    private

    def remove_xenio_zones
        if self.account.xenio_zone_active_tag
            self.account.xenio_zone_active_tag.update(tags: [])
        end
        xenio_zones.destroy_all
    end

    def remove_xenio_places
        if self.account.xenio_place_active_tag
            self.account.xenio_place_active_tag.update(tags: [])
        end
        xenio_places.destroy_all
    end
end
