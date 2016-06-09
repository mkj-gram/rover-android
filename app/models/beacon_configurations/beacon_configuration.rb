class BeaconConfiguration < ActiveRecord::Base
    include Elasticsearch::Model
    include DefaultEmptyArray

    # Constants
    IBEACON_PROTOCOL                = 1
    EDDYSTONE_NAMESPACE_PROTOCOL    = 2
    URL_PROTOCOL                    = 3
    NO_PROTOCOL                     = 4

    # use to search through all document types
    document_type ""

    settings index: ElasticsearchShardCountHelper.get_settings({ number_of_shards: 2, number_of_replicas: 1}).merge(
        {
            analysis:  {
                filter: {
                    autocomplete_filter: {
                        type: "edge_ngram",
                        min_gram: 1,
                        max_gram: 15
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

    default_empty_array_attribute :tags

    after_commit on: [:create] do
        __elasticsearch__.index_document
    end

    after_commit on: [:update] do
        if previous_changes.include?("place_id")
            __elasticsearch__.index_document
        else
            __elasticsearch__.update_document
        end
    end

    after_commit on: [:destroy] do
        __elasticsearch__.delete_document
    end

    before_save :track_google_pending_changes
    before_save :remove_duplicate_tags
    after_save :update_active_tags
    after_save :update_place

    after_create :increment_account_beacons_count
    after_destroy :decrement_account_beacons_count

    belongs_to :account
    belongs_to :place, counter_cache: :beacon_configurations_count

    has_many :shared_beacon_configurations

    validate :place_exists
    validates :title, presence: true
    validates :account_id, presence: true

    def self.create_index!(opts = {})
        begin
            self.__elasticsearch__.delete_index! if opts[:force]
        rescue Elasticsearch::Transport::Transport::Errors::NotFound => e
        end
        client = self.__elasticsearch__.client

        if !client.indices.exists?(index: BeaconConfiguration.index_name)
            begin
                client.indices.create(index: BeaconConfiguration.index_name, body: BeaconConfiguration.settings.to_hash)
                client.indices.put_mapping(index: BeaconConfiguration.index_name, type: IBeaconConfiguration.document_type, body: IBeaconConfiguration.mappings.to_hash)
                client.indices.put_mapping(index: BeaconConfiguration.index_name, type: EddystoneNamespaceConfiguration.document_type, body: EddystoneNamespaceConfiguration.mappings.to_hash)
                client.indices.put_mapping(index: BeaconConfiguration.index_name, type: UrlConfiguration.document_type, body: UrlConfiguration.mappings.to_hash)
            rescue  Exception => e
                Rails.logger.warn("Tried creating BeaconConfiguration elasticsearch index")
                Rails.logger.warn("Message: #{e}")
            end

        end

    end


    def as_indexed_json(options = {})
        json = {
            account_id: self.account_id,
            title: self.title,
            tags: self.tags,
            enabled: self.enabled,
            shared: self.shared,
            created_at: self.created_at,
            shared_account_ids: self.shared_account_ids,
            place: indexed_place,
            devices_meta: devices_meta
        }
        return json
    end

    def reindex_place
        self.__elasticsearch__.update_document_attributes({place: indexed_place})
    end

    def reindex_devices_meta
        self.__elasticsearch__.update_document_attributes({devices_meta: self.devices_meta})
    end

    def formatted_type
        case type
        when ibeacon_type
            "ibeacon-configurations"
        when eddystone_namespace_type
            "eddystone-namespace-configurations"
        end
    end

    def tags=(value)
        if value.nil?
            self[:tags] = []
        else
            self[:tags] = value
        end
    end

    def devices_meta
        # we use to_a here to remove the active record relation
        @devices_meta ||= Rails.cache.fetch(devices_meta_cache_key) do
            devices = beacon_devices.all.to_a
            count = devices.size
            # there isn't any devices so return right away
            if count == 0
                {}
            else
                # check to see if they are all the same type
                first_device_manufacturer = devices.first.manufacturer

                if devices.all? {|device| device.manufacturer == first_device_manufacturer}
                    # they are all the same manufacturer
                    # select the first device
                    type = devices.first.manufacturer_model
                else
                    # we have multiple types
                    type = "multi"
                end

                {
                    type: type,
                    count: count
                }
            end
        end

        return @devices_meta
    end

    def message_attributes
        {
            "name" => title,
            "tags" => tags,
            "enabled" => enabled,
            "shared" => shared,
            "uuid" => uuid,
            "major-number" => major,
            "minor-number" => minor,
            "namespace" => namespace,
            "instance-id" => instance_id,
            "url" => url
        }
    end


    protected

    def place_exists
        if changes.include?(:place_id) && !place_id.nil? && !Place.exists?(place_id)
            errors.add(:place_id, "place doesn't exist")
        end
    end

    def update_place
        if changes.include?(:place_id) && place_id_was != place_id
            old_place = place_id_was.nil? ? nil : Place.find_by_id(place_id_was)
            old_place.__elasticsearch__.update_document  if old_place

            new_place = place
            new_place.__elasticsearch__.update_document if new_place
        end
    end



    def devices_meta_cache_key
        "beacon_configurations/#{self.id}/devices_meta/#{self.beacon_devices_updated_at.to_i}"
    end

    def shared_account_ids
        shared_beacon_configurations.map(&:shared_account_id)
    end

    private

    def track_google_pending_changes
        if registered_with_google && has_pending_google_update == false && ( place_id_changed? || indoor_level_changed? || title_changed?)
            self.has_pending_google_update = true
        end
    end

    def update_active_tags
        if self.changes.include?(:tags)
            previous_tags = (tags_was || [])
            uniq_tags = (tags || []).uniq
            old_tags = previous_tags - uniq_tags
            new_tags = uniq_tags - previous_tags
            BeaconConfigurationActiveTag.update_tags(self.account_id, old_tags, new_tags)
        end
    end

    def indexed_place
        if place
            return {
                name: place.title,
                id: place.id,
                tags: place.tags
            }
        else
            return {}
        end
    end

    def remove_duplicate_tags
        self.tags.uniq! if self.tags
    end

    def increment_account_beacons_count
        Account.update_counters(self.account_id, :searchable_beacon_configurations_count => 1, :beacon_configurations_count => 1)
    end

    def decrement_account_beacons_count
        Account.update_counters(self.account_id, :searchable_beacon_configurations_count => -1, :beacon_configurations_count => -1)
    end

    def ibeacon_type
        @ibeacon_type ||= IBeaconConfiguration.name
    end

    def eddystone_namespace_type
        @eddystone_namespace_type ||= EddystoneNamespaceConfiguration.name
    end

end
