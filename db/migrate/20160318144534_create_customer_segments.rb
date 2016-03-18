class CreateCustomerSegments < ActiveRecord::Migration
    def change
        create_table :customer_segments do |t|
            t.integer :account_id
            t.string :title
            t.jsonb :filters
            t.integer :approximate_customers_count
        end

        add_index :customer_segments, :account_id
    end
end
