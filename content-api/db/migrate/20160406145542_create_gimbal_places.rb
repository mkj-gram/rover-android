class CreateGimbalPlaces < ActiveRecord::Migration
    def change

        create_table :gimbal_places, id: false do |t|
            t.integer :account_id, null: false
            t.string :id, null: false
            t.string :name

            t.timestamps null: false
        end
        
        add_index :gimbal_places, :id, unique: true
        add_index :gimbal_places, :account_id
    end
end
