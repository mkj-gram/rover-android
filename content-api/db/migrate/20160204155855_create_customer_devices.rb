class CreateCustomerDevices < ActiveRecord::Migration
    def change
        create_table :customer_devices do |t|
            t.integer :account_id, null: false
            t.integer :customer_id, null: false
            t.uuid :udid, null: false

            t.string :token
            t.string :locale_lang
            t.string :locale_region
            t.string :time_zone
            t.string :sdk_version
            t.string :platform
            t.string :os_name
            t.string :os_version
            t.string :model
            t.string :manufacturer
            t.string :carrier
            t.string :aid

            t.boolean :background_enabled
            t.boolean :local_notifications_enabled
            t.boolean :remote_notifications_enabled
            t.boolean :location_monitoring_enabled
            t.boolean :bluetooth_enabled
        end

        add_index :customer_devices, :udid, unique: true
    end
end
