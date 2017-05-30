class Place < ActiveRecord::Base
    include Elasticsearch::Model

    after_commit on: [:create, :update] do
        __elasticsearch__.index_document
    end

    after_commit on: [:destroy] do
        __elasticsearch__.delete_document
    end

    settings index: ElasticsearchShardCountHelper.get_settings({ number_of_shards: 1, number_of_replicas: 2 }).merge(
        {
            analysis:  {
                filter: {
                    autocomplete_filter: {
                        type: "edge_ngram",
                        min_gram: 1,
                        max_gram: 15,
                        token_chars: ["letter", "digit"]
                    }
                },
                analyzer: {
                    autocomplete: {
                        type: "custom",
                        tokenizer: "standard",
                        filter: [
                            "lowercase",
                            "autocomplete_filter"
                        ]
                    },
                    lowercase_keyword: {
                        type: "custom",
                        tokenizer: "keyword",
                        filter: [
                            "lowercase"
                        ]
                    }
                }
            }
        }
    )

    mapping do
        indexes :account_id, type: 'long', index: 'not_analyzed'
        indexes :formatted_address, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
        indexes :address, type: 'string', index: 'no'
        indexes :city, type: 'string', index: 'no'
        indexes :province, type: 'string', index: 'no'
        indexes :country, type: 'string', index: 'no'
        indexes :postal_code, type: 'string', index: 'no'
        indexes :title, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
        indexes :tags, type: 'string', index: 'not_analyzed'
        indexes :shared_account_ids, type: 'long', index: 'not_analyzed'
        indexes :location, type: "geo_point", lat_lon: true
        indexes :radius, type: 'integer', index: 'no'
        indexes :enabled, type: 'boolean', index: 'not_analyzed'
        indexes :beacon_configurations_count, type: 'integer', index: 'no'
        indexes :created_at, type: 'date'
    end



    validates :title, presence: true
    validates :radius, inclusion: { in: 50..5000, message: "must be between 50 and 5000" }
    validates :latitude, presence: true, inclusion: { in: -90..90, message: "must be between -90 and 90" }
    validates :longitude, presence: true, inclusion: { in: -180..180, message: "must be between -180 and 180" }


    belongs_to :account, touch: :places_updated_at
    has_many :beacon_configurations

    # before_save :update_address_from_google_place
    after_save :update_active_tags
    after_save :update_beacon_configurations_elasticsearch_document

    after_create :increment_account_places_count
    after_destroy :decrement_account_places_count

    def self.create_index!(opts = {})
        self.__elasticsearch__.create_index!(opts)
    end

    def as_indexed_json(options = {})
        {
            account_id: self.account_id,
            title: self.title,
            tags: self.tags,
            enabled: self.enabled,
            shared: self.shared,
            created_at: self.created_at,
            address: self.address,
            city: self.city,
            province: self.province,
            country: self.country,
            postal_code: self.postal_code,
            location: {lat: self.latitude, lon: self.longitude},
            radius: self.radius,
            formatted_address: self.formatted_address,
            shared_account_ids: self.shared_account_ids,
            beacon_configurations_count: self.beacon_configurations_count
        }
    end

    def latitude
        read_attribute(:latitude).to_f
    end

    def longitude
        read_attribute(:longitude).to_f
    end

    def shared_account_ids
        []
    end

    def formatted_address
        "#{self.address} #{self.city} #{self.province} #{self.postal_code} #{self.country}"
    end

    def message_attributes
        {
            "name" => title,
            "tags" => tags,
            "shared" => shared,
            "address" => address,
            "city" => city,
            "province" => province,
            "country" => country,
            "postal-code" => postal_code,
            "formatted-address" => formatted_address
        }
    end

    private

    def increment_account_places_count
        Account.update_counters(self.account_id, :places_count => 1, :searchable_places_count => 1)
    end

    def decrement_account_places_count
        Account.update_counters(self.account_id, :places_count => 1, :searchable_places_count => 1)
    end

    def update_address_from_google_place
        if self.changes.include?(:google_place_id) && google_place_id_was != google_place_id
            begin
                place = GooglePlace.new(google_place_id)
                self.title ||= place.name
                self.address = place.address
                self.city ||= place.city
                self.province ||= place.province
                self.country ||= place.country
                self.postal_code ||= place.postal_code
                self.latitude = place.latitude
                self.longitude = place.longitude
            rescue Exception => e
                errors.add(:google_place_id, "invalid id")
                return false
            end
        end
    end

    def update_active_tags
        if self.changes.include?(:tags)
            previous_tags = (tags_was || [])
            uniq_tags = (tags || []).uniq
            old_tags = previous_tags - uniq_tags
            new_tags = uniq_tags - previous_tags
            PlaceActiveTag.update_tags(self.account_id, old_tags, new_tags)
        end
    end

    def update_beacon_configurations_elasticsearch_document
        # only if the name has changed do we need to update the elasticsearch documents of the beacons
        # who are attached to this
        if changes.include?(:title) || changes.include?(:tags)
            Rails.logger.debug("Reindexing #{beacon_configurations.size} beacon configurations")
            beacon_configurations.each do |config|
                config.__elasticsearch__.update_document_attributes({location: {name: self.title, id: self.id, tags: self.tags}})
            end
        end
    end
end