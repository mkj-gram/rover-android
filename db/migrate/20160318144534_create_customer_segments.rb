class CreateCustomerSegments < ActiveRecord::Migration
    def change
        create_table :customer_segments do |t|
            t.integer :account_id, null: false
            t.string :title
            t.jsonb :filters, array: true, default: []
            t.integer :approximate_customers_count

            t.timestamps null: false
        end

        add_index :customer_segments, :account_id
    end
end
