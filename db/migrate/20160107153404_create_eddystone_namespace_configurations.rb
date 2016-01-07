class CreateEddystoneNamespaceConfigurations < ActiveRecord::Migration
    def change
        create_table :eddystone_namespace_configurations do |t|
            t.integer :account_id, null: false
            # 10 byte string id 8b0ca750095477cb3e77
            t.string :namespace
            # 6 byte integer id 12312
            t.integer :namespace_id
        end
        add_index :eddystone_namespace_configurations, :account_id
        add_index :eddystone_namespace_configurations, :namespace
        add_index :eddystone_namespace_configurations, [:namespace, :namespace_id], unique: true, name: "eddystone_namespace_uuid"
    end
end
