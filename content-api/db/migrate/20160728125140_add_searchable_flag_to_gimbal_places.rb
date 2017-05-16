class AddSearchableFlagToGimbalPlaces < ActiveRecord::Migration
    def change
        add_column :gimbal_places, :searchable, :boolean, default: true
    end
end
