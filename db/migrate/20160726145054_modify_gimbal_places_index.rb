class ModifyGimbalPlacesIndex < ActiveRecord::Migration
    def up

        remove_index :gimbal_places, :id
        remove_index :gimbal_places, :account_id

        add_index :gimbal_places, [:id, :account_id], unique: true

    end

    def down

        add_index :gimbal_places, :id, unique: true
        add_index :gimbal_places, :account_id

        remove_index :gimbal_places, [:id, :account_id]
        
    end
end
