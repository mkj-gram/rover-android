class CreateActiveTags < ActiveRecord::Migration
    def change
        create_table :active_tags do |t|
            t.integer :account_id
            t.string :type
            t.string :tags, array: true, default: []
        end

        add_index :active_tags, :account_id
        add_index :active_tags, [:account_id, :type]
    end
end
