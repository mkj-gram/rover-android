class BeaconConfiguration < ActiveRecord::Base
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    # use to search through all document types
    document_type ""

    settings index: {
        number_of_shards: 1,
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
                }
            }
        }
    }

    before_update :update_active_tags
    after_create :increment_searchable_beacon_configurations_count
    after_destroy :decrement_searchable_beacon_configurations_count

    belongs_to :account
    belongs_to :location
    has_one :beacon_configuration_active_tags_index, foreign_key: "account_id", primary_key: "account_id"
    has_many :shared_beacon_configurations


    def formatted_type
        case type
        when ibeacon_type
            "ibeacon-configurations"
        when eddystone_namespace_type
            "eddystone-namespace-configurations"
        end
    end

    def update_active_tags

        new_tags = self.changes[:tags].second - self.changes[:tags].first
        old_tags = self.changes[:tags].first - self.changes[:tags].second
        old_tags_to_delete.select do |tag|
            !BeaconConfiguration.where('tags @> ?', "{#{tag}}").where(account_id: self.account_id).exists?
        end
        new_tags = self.tags
        # lock this row since we are updating and deleting the tags in the application level
        # beacon_configuration_active_tags.lock!
        beacon_configuration_active_tags_index.tags += new_tags
        beacon_configuration_active_tags_index.tags -= old_tags_to_delete
        beacon_configuration_active_tags_index.save

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

    def shared_account_ids
        shared_beacon_configurations.map(&:shared_account_id)
    end

    private

    def increment_searchable_beacon_configurations_count
        Account.updating_counters(self.account_id, :searchable_beacon_configurations_count => 1)
    end

    def decrement_searchable_beacon_configurations_count
        Account.updating_counters(self.account_id, :searchable_beacon_configurations_count => -1)
    end

    def ibeacon_type
        @ibeacon_type ||= IBeaconConfiguration.name
    end

    def eddystone_namespace_type
        @eddystone_namespace_type ||= EddystoneNamespaceConfiguration.name
    end

end
