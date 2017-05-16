class AddRegionCacheColumnsToAccounts < ActiveRecord::Migration
    def change
        add_column :accounts, :places_updated_at, :datetime, default: Time.zone.now
        add_column :accounts, :beacon_configurations_updated_at, :datetime, default: Time.zone.now
    end
end
