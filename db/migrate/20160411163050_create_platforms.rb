class CreatePlatforms < ActiveRecord::Migration

    def change
        create_table :platforms do |t|
            t.integer :account_id, null: false
            t.string :type, null: false # APNS App, GCM APP
            t.string :app_identifier
            t.text :encrypted_credentials
            t.text :encrypted_credentials_salt
            t.text :encrypted_credentials_iv

            t.timestamps null: false
        end

        add_index :platforms, [:account_id, :type]
    end
end
