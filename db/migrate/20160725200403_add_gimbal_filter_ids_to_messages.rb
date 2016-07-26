class AddGimbalFilterIdsToMessages < ActiveRecord::Migration
    def change
        remove_column :message_templates, :filter_gimbal_place_id
        add_column :message_templates, :filter_gimbal_place_ids, :integer, array: true, default: []
    end
end
