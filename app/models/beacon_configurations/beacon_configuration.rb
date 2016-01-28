class BeaconConfiguration < ActiveRecord::Base
    include Elasticsearch::Model
    # include Elasticsearch::Model::Callbacks

    # use to search through all document types
    document_type ""

    settings index: {
        number_of_shards: 3,
        number_of_replicas: 1
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
    after_create :increment_searchable_beacon_configurations_count
    after_destroy :decrement_searchable_beacon_configurations_count

    belongs_to :account
    belongs_to :location

    has_one :beacon_configuration_active_tags_index, foreign_key: "account_id", primary_key: "account_id"
    has_many :shared_beacon_configurations

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



    protected

    def indexed_location
        if !self.location_id.nil?
            return {
                name: location.name
            }
        else
            return {}
        end
    end

    def devices_meta
        # we use to_a here to remove the active record relation
        devices = beacon_devices.all.to_a
        count = devices.size
        # there isn't any devices so return right away
        return {} if count == 0
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

        return {
            type: type,
            count: count
        }
    end

    def shared_account_ids
        shared_beacon_configurations.map(&:shared_account_id)
    end

    private

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
