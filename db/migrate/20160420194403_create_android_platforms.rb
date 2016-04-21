class CreateAndroidPlatforms < ActiveRecord::Migration
    def change
        create_table :android_platforms do |t|
            t.integer :account_id, null: false
            t.string :title
            t.string :package_name

            t.text :encrypted_credentials
            t.text :encrypted_credentials_salt
            t.text :encrypted_credentials_iv

            t.timestamps null: false
        end

        add_index :android_platforms, :account_id, unique: true
    end
end
