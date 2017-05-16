class SharedBeaconConfiguration < ActiveRecord::Base

    belongs_to :owner_account, class_name: "Account", foreign_key: "owner_account_id"
    belongs_to :shared_account, class_name: "Account", foreign_key: "shared_account_id"
    belongs_to :beacon_configuration

    after_create :re_index_beacon_configuration
    after_destroy :re_index_beacon_configuration

    after_create :increment_searchable_beacon_configurations_count
    after_destroy :decrement_searchable_beacon_configurations_count



    private

    def re_index_beacon_configuration
        beacon_configuration.__elastic_search.update_document
    end

    # when we share a beacon we need to update the counter to reflect the total amount of beacons we can search for
    def increment_searchable_beacon_configurations_count
        Account.update_counters(self.shared_account_id, :searchable_beacon_configurations_count => 1)
    end

    def decrement_searchable_beacon_configurations_count
        Account.update_counters(self.shared_account_id, :searchable_beacon_configurations_count => -1)
    end

end
