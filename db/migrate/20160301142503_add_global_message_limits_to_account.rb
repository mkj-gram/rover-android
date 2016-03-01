class AddGlobalMessageLimitsToAccount < ActiveRecord::Migration

    def change
        add_column :accounts, :global_message_limit_per_day, :integer
        add_column :accounts, :global_message_limit_per_week, :integer
        add_column :accounts, :global_message_limit_per_month, :integer
        add_column :accounts, :global_message_limit_per_year, :integer
    end

end
