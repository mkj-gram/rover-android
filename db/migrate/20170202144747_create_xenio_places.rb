class CreateXenioPlaces < ActiveRecord::Migration
    def change
        create_table :xenio_places, id: false do |t|
            t.string :id, null: false
            t.integer :account_id, null: false
            t.string :name
            t.string :tags, array: true, default: []
            t.integer :xenio_integration_id, :integer

            t.timestamps null: false
        end


        add_index :xenio_places, [:id, :account_id], unique: true
        add_index :xenio_places, :xenio_integration_id
    end
end
