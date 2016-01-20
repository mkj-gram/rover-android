class ThirdPartyIntegrationSyncJob < ActiveRecord::Base

    enum status: [ :queued, :started, :finished ]

    after_create :perform_async

    belongs_to :third_party_integration

    def start!
        self.update({status: :started, started_at: DateTime.now })
    end

    def finish!
        transaction do
            self.update({status: :finished, finished_at: DateTime.now })
            third_party_integration.update({syncing: false})
        end
    end

    private

    def perform_async
        # creates the rabbitmq job
        SyncThirdPartyIntegrationWorker.perform_async(self.id)
    end
end
