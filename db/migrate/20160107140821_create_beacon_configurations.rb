class CreateBeaconConfigurations < ActiveRecord::Migration
    def change
        create_table :beacon_configurations do |t|
            t.integer :account_id, null: false
            t.integer :location_id
            t.string :configurable_type
            t.integer :configurable_id
            t.string :title
            t.text :tags, array: true, default: []
            t.integer :devices_count, default: 0
        end

        add_index :beacon_configurations, [:account_id, :configurable_type], name: "beacon_configurations_account_configurable_type"
        add_index :beacon_configurations, [:configurable_id, :configurable_type], name: "beacon_configurations_account_configurable_index"
    end
end
