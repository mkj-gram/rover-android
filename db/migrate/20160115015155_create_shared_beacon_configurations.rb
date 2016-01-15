class CreateSharedBeaconConfigurations < ActiveRecord::Migration
    def change
        create_table :shared_beacon_configurations do |t|
            t.integer :owner_account_id
            t.integer :shared_account_id
            t.integer :beacon_configuration_id
        end

        add_index :shared_beacon_configurations, :owner_account_id
        add_index :shared_beacon_configurations, :shared_account_id
    end
end
