class BeaconConfiguration < ActiveRecord::Base
    include Elasticsearch::Model
    # include Elasticsearch::Model::Callbacks

    # use to search through all document types
    document_type ""

    settings index: {
        number_of_shards: 1,
        number_of_replicas: 2,
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

    before_save :update_active_tags
    before_save :remove_duplicate_tags
    after_save :update_location

    belongs_to :account
    belongs_to :location, counter_cache: :beacon_configurations_count

    has_one :beacon_configuration_active_tags_index, foreign_key: "account_id", primary_key: "account_id"
    has_many :shared_beacon_configurations

    validate :location_exists

    def as_indexed_json(options = {})
        json = {
            account_id: self.account_id,
            title: self.title,
            tags: self.tags,
            enabled: self.enabled,
            shared: self.shared,
            created_at: self.created_at,
            shared_account_ids: self.shared_account_ids,
            location: self.indexed_location,
            devices_meta: self.devices_meta
        }

        if self.tags.any?
            json.merge!(
                {
                    suggest_tags: {
                        input: self.tags,
                        context: {
                            account_id: self.account_id,
                            shared_account_ids: self.account_id
                        }
                    }
                }
            )
        end

        return json
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

    def update_active_tags
        if self.changes.include?(:tags)
            Rails.logger.info("searching for tags: #{tags} with changes #{self.changes}")
            new_tags = self.changes[:tags].second - self.changes[:tags].first
            old_tags = self.changes[:tags].first - self.changes[:tags].second
            old_tags_to_delete = old_tags.select do |tag|
                !BeaconConfiguration.where('tags @> ?', "{#{tag}}").where(account_id: self.account_id).exists?
            end
            new_tags = self.tags
            # lock this row since we are updating and deleting the tags in the application level
            # beacon_configuration_active_tags.lock!
            beacon_configuration_active_tags_index.tags += new_tags
            beacon_configuration_active_tags_index.tags -= old_tags_to_delete
            beacon_configuration_active_tags_index.save
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

    protected
    def location_exists
        if changes.include?(:location_id) && !location_id.nil? && !Location.exists?(location_id)
            errors.add(:location_id, "location doesn't exist")
        end
    end

    def update_location
        if changes.include?(:location_id) && location_id_was != location_id
            old_location = location_id_was.nil? ? nil : Location.find_by_id(location_id_was)
            old_location.__elasticsearch__.update_document  if old_location

            new_location = location
            new_location.__elasticsearch__.update_document if new_location
        end
    end

    def indexed_location
        if !self.location_id.nil? && self.location
            return {
                name: location.title,
                id: location.id
            }
        else
            return {}
        end
    end

    def devices_meta_cache_key
        "beacon_configurations/#{self.id}/devices_meta/#{self.beacon_devices_updated_at.to_i}"
    end

    def shared_account_ids
        shared_beacon_configurations.map(&:shared_account_id)
    end

    private

    def remove_duplicate_tags
        self.tags.uniq! if self.tags
    end
    def increment_searchable_beacon_configurations_count
        Account.update_counters(self.account_id, :searchable_beacon_configurations_count => 1)
    end

    def decrement_searchable_beacon_configurations_count
        Account.update_counters(self.account_id, :searchable_beacon_configurations_count => -1)
    end

    def ibeacon_type
        @ibeacon_type ||= IBeaconConfiguration.name
    end

    def eddystone_namespace_type
        @eddystone_namespace_type ||= EddystoneNamespaceConfiguration.name
    end

end
