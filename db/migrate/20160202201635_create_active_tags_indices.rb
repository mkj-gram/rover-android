class CreateActiveTagsIndices < ActiveRecord::Migration
    def change
        create_table :active_tags_indices do |t|
            t.integer :account_id, null: false
            t.string :type, null: false
            t.string :tags, array: true, default: []
        end

        # look up by type
        add_index :active_tags_indices, [:account_id, :type], unique: true
    end
end
