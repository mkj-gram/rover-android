class AddSearchableXenioZonesAndPlacesCountToAccounts < ActiveRecord::Migration
    def change

        add_column :accounts, :searchable_xenio_zones_count, :integer, default: 0
        add_column :accounts, :searchable_xenio_places_count, :integer, default: 0
        
    end
end
