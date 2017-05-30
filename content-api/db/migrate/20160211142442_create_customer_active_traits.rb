class CreateCustomerActiveTraits < ActiveRecord::Migration
    def change
        create_table :customer_active_traits do |t|
            t.integer :account_id, null: false
            t.string :trait_key
            t.string :trait_type
        end

        add_index :customer_active_traits, :account_id
        add_index :customer_active_traits, [:account_id, :trait_key], unique: true
    end
end