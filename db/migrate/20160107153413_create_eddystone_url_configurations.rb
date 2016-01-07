class CreateEddystoneUrlConfigurations < ActiveRecord::Migration
    def change
        create_table :eddystone_url_configurations do |t|
            t.integer :account_id, null: false
            # rov.er/123n123n
            t.text :url
        end
        add_index :eddystone_url_configurations, :account_id
        add_index :eddystone_url_configurations, :url
    end
end
