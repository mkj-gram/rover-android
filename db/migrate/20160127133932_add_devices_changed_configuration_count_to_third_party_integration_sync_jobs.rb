class AddDevicesChangedConfigurationCountToThirdPartyIntegrationSyncJobs < ActiveRecord::Migration
    def change
        add_column :third_party_integration_sync_jobs, :devices_changed_configuration_count, :integer, default: 0
    end
end
