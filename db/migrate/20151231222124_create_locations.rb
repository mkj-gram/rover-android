class CreateLocations < ActiveRecord::Migration
    def change
        enable_extension "btree_gin"
        create_table :locations do |t|
            t.integer :account_id, null: false
            t.string :title
            t.text :address
            t.text :city
            t.text :province
            t.string :country
            t.string :postal_code
            t.float :latitude, {:precision=>10, :scale=>6}
            t.float :longitude, {:precision=>10, :scale=>6}
            t.integer :radius, default: 50
            t.text :tags, array: true, default: []
            t.text :google_place_id

            t.boolean :enabled, default: true
            t.boolean :shared, default: false

            # counter_cache
            t.integer :beacon_configurations_count, default: 0
            t.timestamps null: false
        end

        add_index :locations, :account_id
        add_index :locations, [:account_id, :tags], using: :gin
        add_index :locations, [:account_id, :latitude, :longitude], unique: true
    end
end
