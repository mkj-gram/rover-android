class CreateIbeaconConfigurations < ActiveRecord::Migration
    def change
        create_table :ibeacon_configurations do |t|
            t.integer :account_id, null: false
            t.string :uuid
            t.integer :major
            t.integer :minor
        end
        add_index :ibeacon_configurations, :account_id
        add_index :ibeacon_configurations, [:uuid, :major, :minor], unique: true
    end
end
