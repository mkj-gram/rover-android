class CreateXenioZones < ActiveRecord::Migration
    def change
        create_table :xenio_zones do |t|
            t.string :xenio_id, null: false
            t.integer :account_id, null: false
            t.string :name
            t.string :place_id
            t.string :tags, array: true, default: []
            t.integer :xenio_integration_id, :integer
            t.timestamps null: false
        end


        add_index :xenio_zones, [:xenio_id, :account_id], unique: true
        add_index :xenio_zones, :xenio_integration_id
    end
end