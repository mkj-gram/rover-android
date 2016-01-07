class CreateLocations < ActiveRecord::Migration
    def change
        create_table :locations do |t|
            t.integer :account_id, null: false
            t.text :name
            t.text :address
            t.text :city
            t.text :province_state
            t.text :postal_zip
            t.text :country
            t.decimal :latitude
            t.decimal :longitude
            t.integer :radius
            t.text :google_place_id
            t.text :tags, array: true, default: []

            # counter_cache
            t.integer :beacon_configurations_count, default: 0
            t.timestamps null: false
        end

        add_index :locations, :account_id
    end
end
