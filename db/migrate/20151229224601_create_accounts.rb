class CreateAccounts < ActiveRecord::Migration
    def change
        create_table :accounts do |t|
            t.text :title
            t.integer :primary_user_id
            t.text :token, null: false
            t.text :share_key, null: false

            # cache counters
            t.integer :users_count, default: 0
            t.integer :locations_count, default: 0
            t.integer :searchable_beacon_configurations_count, default: 0
            t.integer :searchable_locations_count, default: 0
            t.integer :account_invites_count, default: 0

            t.timestamps null: false
        end

        add_index :accounts, :token, unique: true
        add_index :accounts, :share_key, unique: true
    end
end
