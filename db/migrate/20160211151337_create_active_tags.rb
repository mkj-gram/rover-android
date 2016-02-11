class CreateActiveTags < ActiveRecord::Migration
    def change
        create_table :active_tags do |t|
            t.integer :account_id
            t.string :type
            t.string :tag
        end

        add_index :active_tags, :account_id
        add_index :active_tags, [:account_id, :type]
        add_index :active_tags, [:account_id, :type, :tag], unique: true
    end
end
