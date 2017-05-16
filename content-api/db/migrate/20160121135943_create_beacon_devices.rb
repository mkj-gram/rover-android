class CreateBeaconDevices < ActiveRecord::Migration
    def change
        create_table :beacon_devices do |t|
            t.integer :account_id, null: false
            t.integer :third_party_integration_id, null: false
            t.string :manufacturer_id, null: false
            t.string :type, null: false


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

            t.jsonb :device_data, default: {}
        end

        add_index :beacon_devices, [:account_id, :manufacturer_id], unique: true
        add_index :beacon_devices, :third_party_integration_id

        add_index :beacon_devices, [:account_id, :uuid, :major, :minor], name: "index_account_ibeacon_devices"
        add_index :beacon_devices, [:account_id, :namespace, :instance_id], name: "index_account_eddystone_devices"
        add_index :beacon_devices, [:account_id, :url]
    end
end


# estimote
