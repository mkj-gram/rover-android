class ModifyGimbalPlacesIndex < ActiveRecord::Migration
    def up

        remove_index :gimbal_places, :id
        remove_index :gimbal_places, :account_id

        remove_column :gimbal_places, :id
        add_column :gimbal_places, :id, :primary_key

        add_column :gimbal_places, :gimbal_place_id, :string

        add_index :gimbal_places, :gimbal_place_id
        add_index :gimbal_places, [:gimbal_place_id, :gimbal_integration_id], name: "index_gimbal_places_on_gimbal_place_id_and_integration_id"

    end

    def down

        remove_column :gimbal_places, :id
        
        add_column :gimbal_places, :id, :string
    	add_index :gimbal_places, :id, unique: true
    	
        remove_column :gimbal_places, :gimbal_place_id

        remove_index :gimbal_places, :gimbal_place_id
    	remove_index :gimbal_places, [:gimbal_place_id, :gimbal_integration_id]

    end
end
