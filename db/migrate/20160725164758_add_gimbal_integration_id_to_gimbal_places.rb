class AddGimbalIntegrationIdToGimbalPlaces < ActiveRecord::Migration
    def change
        add_column :gimbal_places, :gimbal_integration_id, :integer
        add_index :gimbal_places, :gimbal_integration_id
    end
end
