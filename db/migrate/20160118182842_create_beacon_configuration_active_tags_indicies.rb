class CreateBeaconConfigurationActiveTagsIndicies < ActiveRecord::Migration
    def change
        create_table :beacon_configuration_active_tags_indices do |t|
            t.integer :account_id, null: false
            t.string :tags, array: true, default: []
        end

        add_index :beacon_configuration_active_tags_indices, :account_id, unique: true
        add_index :beacon_configuration_active_tags_indices, :tags, using: :gin
    end
end
