class CreateBeaconConfigurations < ActiveRecord::Migration
    def change
        enable_extension "btree_gin"
        create_table :beacon_configurations do |t|
            t.integer :account_id, null: false
            t.integer :location_id
            t.string :type, null: false
            t.text :title
            t.string :tags, array: true, default: []
            # t.text :tags, default: ""
            t.boolean :enabled, default: true
            t.boolean :shared, default: false
            # ibeacon
            t.string :uuid
            t.integer :major
            t.integer :minor

            # eddystone-uuid
            # global unique on namespace & instance_id
            # account wise namespace is unique
            #
            # 10 byte string id 8b0ca750095477cb3e77
            t.string :namespace
            # 6 byte string id 12312
            t.string :instance_id

            # eddystone-url
            t.text :url

            t.datetime :beacon_devices_updated_at
            t.timestamps
        end

        add_index :beacon_configurations, :account_id
        add_index :beacon_configurations, [:account_id, :type]
        add_index :beacon_configurations, [:account_id, :type, :created_at], name: "beacon_configurations_type_created_at_index"
        add_index :beacon_configurations, :location_id

        # checking if a uuid already exists
        # or grab all configs with the same uuid
        add_index :beacon_configurations, :uuid

        add_index :beacon_configurations, [:account_id, :uuid, :major, :minor], unique: true, name: "account_ibeacon_index"

        add_index :beacon_configurations, [:account_id, :namespace, :instance_id], unique: true, name: "account_eddystone_namespace_index"

        add_index :beacon_configurations, :url, unique: true

        # we will use elasticsearch
        add_index :beacon_configurations, [:account_id, :tags], using: :gin


    end
end
