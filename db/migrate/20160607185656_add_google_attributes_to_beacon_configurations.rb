class AddGoogleAttributesToBeaconConfigurations < ActiveRecord::Migration
    def change
        add_column :beacon_configurations, :registered_with_google, :boolean, default: false
        add_column :beacon_configurations, :has_pending_google_update, :boolean, default: false
        add_column :beacon_configurations, :indoor_level, :string
        add_column :beacon_configurations, :google_beacon_name, :string

        add_index :beacon_configurations, [:account_id, :registered_with_google], name: "beacon_configurations_registered_with_google"
        add_index :beacon_configurations, [:account_id, :has_pending_google_update], name: "beacon_configurations_pending_google_updates"
        add_index :beacon_configurations, :google_beacon_name
    end
end
