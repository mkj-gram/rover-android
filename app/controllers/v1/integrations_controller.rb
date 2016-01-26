class V1::IntegrationsController < V1::ApplicationController
    before_action :authenticate

    def index
        # show all integrations
        includes_sync = whitelist_include(["latestSync"]).any?


        integrations = current_account.third_party_integrations

        json = {
            "data" => integrations.map do |integration|
                serialize_integration(integration, includes_sync)
            end
        }

        if includes_sync
            included = [
                integrations.map do |integration|
                    serialize_sync_job(integration, integration.latest_sync_job)
                end
            ]
            json["included"] = included
        end

        render json: json
    end

    def show
    end

    private

    def serialize_sync_job(integration, job)
        {
            "type" => "integrations-sync-jobs",
            "id" => job.id.to_s,
            "attributes" => {
                "status" => job.status,
                "started-at" => job.started_at,
                "finished-at" => job.finished_at,
                "error-message" => job.error_message,
                "added-devices-count" => job.added_devices_count,
                "modified-devices-count" => job.modified_devices_count,
                "removed-devices-count" => job.removed_devices_count,
                "created-at" => job.created_at
            },
            "relationships" => {
                "integration" => {
                    "data" => {type: integration.model_type, "id" => integration.id.to_s}
                }
            }
        }
    end

    def serialize_integration(integration, include_lastest_sync_job = false)
        {
            "type" => integration.model_type,
            "id" => integration.id.to_s,
            "attributes" => {
                "enabled" => integration.enabled,
                "syncing" => integration.syncing,
                "last-synced-at" => integration.last_synced_at
            },
            "relationships" => {
                "latestSync" => {
                    "type" => "integrations-sync-jobs",
                    "id" => integration.latest_sync_job.id.to_s
                }
            }
        }
    end
end
