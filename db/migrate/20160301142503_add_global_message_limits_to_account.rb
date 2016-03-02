class AddGlobalMessageLimitsToAccount < ActiveRecord::Migration

    def change
        add_column :accounts, :message_limits, :hstore, array: true, default: []
    end

end
