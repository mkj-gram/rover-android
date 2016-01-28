class RemoveUniqueIndexesFromBeaconConfigurations < ActiveRecord::Migration

    def change
        # accounts can have the same uuid major minor
        remove_index :beacon_configurations, name: "ibeacon_unique_index"
        remove_index :beacon_configurations, name: "eddystone_namespace_unique_index"
    end

end
