class V1::GoogleIntegrationsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema,    only: [:create, :update]
    # before_action :check_access,            only: [:index, :show, :create, :update, :destroy]
    before_action :set_google_integration, only: [:show, :destroy]

    def show
        # grab the integration
        json = serialize_google_integration(@google_integration)
        json["included"] = [ serialize_sync_job(@google_integration, @google_integration.latest_sync_job)] if @google_integration.latest_sync_job
        render json: json
    end

    def create
        if current_account.google_integration.nil?
            json = flatten_request({single_record: true})
            code = json.dig(:data,:google_integrations, :code)
            if code.nil?
                puts json
                render json: { errors: { source: { pointer: "data/attributes/code" }, title: "missing" } }
            else
                google_integration = current_account.build_google_integration
                credentials = GoogleOauthSettings.get_credentials_from_code(code: code)
                google_integration.credentials = {
                    client_id: credentials.client_id,
                    access_token: credentials.access_token,
                    refresh_token: credentials.refresh_token,
                    scope: credentials.scope,
                    expiration_time_millis: (credentials.expires_at.to_i) * 1000
                }
                if google_integration.save
                    json = serialize_google_integration(google_integration)
                    json["included"] = [ serialize_sync_job(google_integration, @google_integration.latest_sync_job)] if @google_integration.latest_sync_job
                    render json: json
                else
                    render json: { errors: V1::GoogleIntegrationErrorSerializer.serialize(google_integration)}, status: :unprocessable_entity
                end
            end
        else
            render json: { errors: [ { title: "Integration already exists" } ] }, status: :unprocessable_entity
        end
    end

    def destroy
        if @google_integration.destroy
            head :no_content
        else
            render json: { errors: V1::GoogleIntegrationErrorSerializer.serialize(@google_integration) }, status: :unprocessable_entity
        end
    end


    private

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
                    "data" => {"type" => integration.model_type, "id" => integration.id.to_s}
                }
            }
        }
    end

    def serialize_google_integration(integration)
        json = {
            "type" => integration.model_type,
            "id" => integration.id.to_s,
            "attributes" => {
                "enabled" => integration.enabled,
                "syncing" => integration.syncing,
                "last-synced-at" => integration.last_synced_at
            }
        }

        if integration.latest_sync_job
            json.merge!(
                {
                    "relationships" => {
                        "latest-sync" => {
                            "data" => {
                                "type" => "sync-jobs",
                                "id" => integration.latest_sync_job.id.to_s
                            }

                        }
                    }
                }
            )
        end

        return json
    end

    def set_google_integration
        @google_integration = GoogleIntegration.find_by_id(params[:id])
        if @google_integration.nil?
            head :not_found and return
        end
    end

end
