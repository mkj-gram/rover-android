class CreateCustomers < ActiveRecord::Migration
    def change
        enable_extension "btree_gin"
        create_table :customers do |t|
            t.integer :account_id, null: false
            t.string :alias
            t.string :name
            t.string :email
            t.string :phone_number
            t.string :tags, array: true, default: []
            t.jsonb :traits, default: {}
            t.timestamps null: false
        end

        add_index :customers, :account_id
        add_index :customers, [:account_id, :alias], unique: true
        add_index :customers, [:account_id, :traits], using: :gin
    end
end
