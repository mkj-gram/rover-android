class Location < ActiveRecord::Base
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    settings index: {
        number_of_shards: 1,
        number_of_replicas: 2,
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
    } do

        mapping do
            indexes :account_id, type: 'long', index: 'not_analyzed'
            indexes :formatted_address, type: 'string', analyzer: "autocomplete", search_analyzer: "standard"
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

    end

    validates :title, presence: true, unless: :google_place_id?
    validates :radius, inclusion: { in: 50..5000, message: "must be between 50 and 5000" }
    validates :latitude, presence: true, inclusion: { in: -90..90, message: "must be between -90 and 90" }, unless: :google_place_id?
    validates :longitude, presence: true, inclusion: { in: -180..180, message: "must be between -180 and 180" }, unless: :google_place_id?


    belongs_to :account, counter_cache: :searchable_locations_count
    has_many :beacon_configurations
    has_one :location_active_tags_index, foreign_key: "account_id", primary_key: "account_id"

    before_save :update_address_from_google_place
    before_save :update_active_tags
    after_save :update_beacon_configurations_elasticsearch_document

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

    def shared_account_ids
        []
    end

    def formatted_address
        "#{self.address} #{self.city} #{self.province} #{self.postal_code} #{self.country}"
    end

    private

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
            Rails.logger.info("searching for tags: #{tags} with changes #{self.changes}")
            new_tags = self.changes[:tags].second - self.changes[:tags].first
            old_tags = self.changes[:tags].first - self.changes[:tags].second
            old_tags_to_delete = old_tags.select do |tag|
                !Location.where('tags @> ?', "{#{tag}}").where(account_id: self.account_id).exists?
            end
            new_tags = self.tags
            # lock this row since we are updating and deleting the tags in the application level
            # beacon_configuration_active_tags.lock!
            location_active_tags_index.tags += new_tags
            location_active_tags_index.tags -= old_tags_to_delete
            location_active_tags_index.save
        end
    end

    def update_beacon_configurations_elasticsearch_document
        # only if the name has changed do we need to update the elasticsearch documents of the beacons
        # who are attached to this
        if changes.include?(:title)
            beacon_configurations.each do |config|
                config.__elasticsearch__.update_document_attributes({location: {name: self.title, id: self.id}})
            end
        end
    end
end
