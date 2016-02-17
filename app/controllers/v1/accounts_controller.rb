class V1::AccountsController < V1::ApplicationController

    before_action :authenticate
    before_action :has_access_to_account
    # GET /accounts/:id
    def show
        json = {
            "data" => {
                "id" => current_account.id.to_s,
                "type" => "accounts",
                "attributes" => {
                    "title" => current_account.title,
                    "token" => current_account.token,
                    "share-key" => current_account.share_key,
                    "configuration-tags" => current_account.beacon_configuration_active_tag.tags,
                    "location-tags" => current_account.location_active_tag.tags,
                    "ibeacon-uuids" => current_account.ibeacon_configuration_uuids.configuration_uuids,
                    "eddystone-namespaces" => current_account.eddystone_namespace_configuration_uuids.configuration_uuids
                },
                "relationships" => {
                    "users" => {
                        "links" => {
                            "self" => v1_users_url
                        }
                    }
                }
            }
        }

        estimote_integration = current_account.estimote_integrations.first
        if estimote_integration
            json["data"]["relationships"].merge!(
                {
                    "estimote-integration" => {
                        "data" => {
                            "type" => "estimote-integrations",
                            "id" => estimote_integration.id.to_s
                        }
                    }
                }
            )

        end
        kontakt_integration = current_account.kontakt_integrations.first
        if kontakt_integration
            json["data"]["relationships"].merge!(
                {
                    "kontakt-integration" => {
                        "data" => {
                            "type" => "kontakt-integrations",
                            "id" => kontakt_integration.id.to_s
                        }
                    }
                }
            )
        end

        included = [estimote_integration, kontakt_integration].compact.map do |integration|
            serialize_integration(integration)
        end

        included += [estimote_integration, kontakt_integration].compact.select{|integration| !integration.latest_sync_job.nil? }.map do |integration|
            serialize_sync_job(integration, integration.latest_sync_job)
        end

        json["included"] = included

        render json: json
    end

    # PATCH/PUT /account
    def update
        json = flatten_request({single_record: true})
        if current_account.update(account_params(json[:data]))
            head :no_content
        else
            render json: @account.errors, status: :unprocessable_entity
        end
    end

    private
    def has_access_to_account
        if current_account.id.to_s != params[:id].to_s
            head :unauthorized
        end
    end
    def account_params(local_params)
        local_params.require(:accounts).permit(:title)
    end


    def serialize_sync_job(integration, job)
        {
            "type" => "sync-jobs",
            "id" => job.id.to_s,
            "attributes" => {
                "status" => job.status,
                "started-at" => job.started_at,
                "finished-at" => job.finished_at,
                "error-message" => job.error_message,
                "added-beacons-count" => job.added_devices_count,
                "modified-beacons-count" => job.modified_devices_count,
                "removed-beacons-count" => job.removed_devices_count,
                "beacons-changed-configuration-count" => job.devices_changed_configuration_count,
                "created-at" => job.created_at
            },
            "relationships" => {
                "integration" => {
                    "data" => {type: integration.model_type, "id" => integration.id.to_s}
                }
            }
        }
    end

    def serialize_integration(integration)
        json = {
            "type" => integration.model_type,
            "id" => integration.id.to_s,
            "attributes" => {
                "enabled" => integration.enabled,
                "syncing" => integration.syncing,
                "last-synced-at" => integration.last_synced_at
            }.merge(integration.credentials_json)
        }

        if integration.latest_sync_job
            json.merge!(
                {
                    "relationships" => {
                        "latest-sync" => {
                            "type" => "sync-jobs",
                            "id" => integration.latest_sync_job.id.to_s
                        }
                    }
                }
            )
        end

        return json
    end
end
