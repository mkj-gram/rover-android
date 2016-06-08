class ConvertSyncJobsToInheritance < ActiveRecord::Migration
    def change
        remove_column :third_party_integration_sync_jobs, :added_devices_count, :integer, default: 0
        remove_column :third_party_integration_sync_jobs, :modified_devices_count, :integer, default: 0
        remove_column :third_party_integration_sync_jobs, :removed_devices_count, :integer, default: 0
        remove_column :third_party_integration_sync_jobs, :devices_changed_configuration_count, :integer, default: 0

        add_column :third_party_integration_sync_jobs, :type, :string
        add_column :third_party_integration_sync_jobs, :stats, :jsonb, default: {}

    end
end
