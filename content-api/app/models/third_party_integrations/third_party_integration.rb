class ThirdPartyIntegration < ActiveRecord::Base
    attr_encrypted :credentials, key: proc { ThirdPartyIntegration.encryption_key }, mode: :per_attribute_iv_and_salt, marshal: true
    # serialize :credentials, JSONHash
    attr_reader :job

    belongs_to :account
    has_many :sync_jobs, class_name: "ThirdPartyIntegrationSyncJob", foreign_key:  "third_party_integration_id" do
        def latest
            last
        end
    end

    has_many :beacon_devices, foreign_key: "third_party_integration_id"

    def latest_sync_job
        # @latest_sync_job ||= Rails.cache.fetch(latest_sync_job_cache_key) do
        #     self.sync_jobs.last
        # end
        @latest_sync_job ||= self.sync_jobs.last
    end

    def start_syncing
        self.update({syncing: true})
    end

    def finish_syncing(finished_at, elapsed_milliseconds)
        self.update({last_synced_at: finished_at, syncing: false})
    end

    def create_sync_job!
        if self.syncing == false
            previous_job = ThirdPartyIntegrationSyncJob.where(third_party_integration_id: self.id).last
            if  previous_job.nil? || (!previous_job.nil? && (previous_job.finished? || previous_job.error? ))
                @job = self.sync_jobs.build
                @job.save
            else
                return false
            end
        else
            return false
        end
    end

    private

    def remove_all_devices
        ThirdPartyIntegrationRemoveDevicesWorker.perform_async(self.id)
    end

    def self.encryption_key
        @encryption_key ||= Rails.application.secrets.secret_encryption_key
    end

    def latest_sync_job_cache_key
        "third_party_integrations/#{self.id}/latest_sync_job-#{self.updated_at.to_i}"
    end
end