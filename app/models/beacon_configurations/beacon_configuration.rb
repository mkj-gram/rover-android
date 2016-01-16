class BeaconConfiguration < ActiveRecord::Base
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    # use to search through all document types
    document_type ""

    settings index: { number_of_shards: 1 } do
        mapping dynamic: false do
            indexes :account_id, type: 'long', index: 'not_analyzed'
            indexes :title, type: 'string', analyzer: 'english'
            indexes :tags, type: 'string'
            indexes :shared_account_ids, type: 'long'
            indexes :uuid, type: 'string'
            indexes :created_at, type: 'date'
        end
    end


    belongs_to :account
    belongs_to :location
    has_many :shared_beacon_configurations



    def as_indexed_json
        # include everything by default

    end

    def formatted_type
        case type
        when ibeacon_type
            "ibeacon-configurations"
        when eddystone_namespace_type
            "eddystone-namespace-configurations"
        end
    end


    def destroy
        Rails.logger.warn("Do not use the parent class please load a child class to remove")
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



    def incremement_counter_cache(child_column)
        Account.update_counters(self.account_id, :beacon_configurations_count => 1, child_column => 1)
    end

    def decrement_counter_cache(child_column)
        Account.update_counters(self.account_id, :beacon_configurations_count => -1, child_column => -1)
    end

    def ibeacon_type
        @ibeacon_type ||= IBeaconConfiguration.name
    end

    def eddystone_namespace_type
        @eddystone_namespace_type ||= EddystoneNamespaceConfiguration.name
    end

end
