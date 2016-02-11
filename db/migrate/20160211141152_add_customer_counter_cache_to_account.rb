class AddCustomerCounterCacheToAccount < ActiveRecord::Migration
    def change
        add_column :accounts, :customers_count, :integer, default: 0
    end
end
