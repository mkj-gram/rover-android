class ThirdPartyIntegrationSyncJob < ActiveRecord::Base

    enum status: [ :queued, :started, :finished, :error ]

    after_create :perform_async

    belongs_to :third_party_integration, counter_cache: true

    def start!
        self.update({status: :started, started_at: DateTime.now })
        third_party_integration.start_syncing
    end

    def sync!
        if third_party_integration
            stats = third_party_integration.sync!
            self.added_devices_count = stats[:added_devices_count]
            self.modified_devices_count = stats[:modified_devices_count]
            self.removed_devices_count = stats[:removed_devices_count]
            self.devices_changed_configuration_count = stats[:devices_changed_configuration_count]
            self.save
        end
    end

    def finish!
        transaction do
            finished_at = DateTime.now
            elapsed_milliseconds = ((finished_at - started_at.to_datetime) * 24 * 60 * 60 * 1000).to_f
            if error_message.nil?
                new_status = :finished
            else
                new_status = :error
            end
            self.update({status: new_status, finished_at: finished_at})
            third_party_integration.finish_syncing(finished_at, elapsed_milliseconds)
        end
    end

    private

    def perform_async
        # creates the rabbitmq job
        SyncThirdPartyIntegrationWorker.perform_async(self.id)
    end
end
