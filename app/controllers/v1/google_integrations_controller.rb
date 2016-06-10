require 'google/apis/cloudresourcemanager_v1beta1'
class V1::GoogleIntegrationsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema,    only: [:create, :update]
    # before_action :check_access,            only: [:index, :show, :create, :update, :destroy]
    before_action :set_google_integration, only: [:show, :update, :destroy]

    def show
        # grab the integration
        json = { "data" => serialize_google_integration(@google_integration, {"project-ids" => meta_project_ids(@google_integration)}) }
        json["included"] = [ serialize_sync_job(@google_integration, @google_integration.latest_sync_job)] if @google_integration.latest_sync_job
        render json: json
    end

    def create
        if current_account.google_integration.nil?
            json = flatten_request({single_record: true})
            code = json.dig(:data,:google_integrations, :code)
            if code.nil?
                render json: { errors: { source: { pointer: "data/attributes/code" }, title: "missing" } }
            else
                google_integration = current_account.build_google_integration(google_integration_params(json[:data]))
                credentials = GoogleOauthSettings.get_credentials_from_code(code: code)
                google_integration.credentials = {
                    project_id: google_integration.project_id,
                    client_id: credentials.client_id,
                    access_token: credentials.access_token,
                    refresh_token: credentials.refresh_token,
                    scope: credentials.scope,
                    expiration_time_millis: (credentials.expires_at.to_i) * 1000
                }
                if google_integration.save
                    json = { "data" => serialize_google_integration(google_integration, {"project-ids" => meta_project_ids(google_integration)}) }
                    json["included"] = [ serialize_sync_job(google_integration, google_integration.latest_sync_job)] if google_integration.latest_sync_job
                    render json: json
                else
                    render json: { errors: V1::GoogleIntegrationErrorSerializer.serialize(google_integration)}, status: :unprocessable_entity
                end
            end
        else
            render json: { errors: [ { title: "Integration already exists" } ] }, status: :unprocessable_entity
        end
    end

    def update
        json = flatten_request({single_record: true})
        if @google_integration.update(google_integration_params(json[:data]))
            json = { "data" => serialize_google_integration(@google_integration, {"project-ids" => meta_project_ids(@google_integration)}) }
            json["included"] = [ serialize_sync_job(@google_integration, @google_integration.latest_sync_job)] if @google_integration.latest_sync_job
            render json: json
        else
            render json: { errors: V1::GoogleIntegrationErrorSerializer.serialize(@google_integration)}, status: :unprocessable_entity
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

    def google_integration_params(local_params)
        local_params.fetch(:google_integrations, {}).permit(:project_id)
    end

    def serialize_sync_job(integration, job)
        {
            "type" => job.model_type,
            "id" => job.id.to_s,
            "attributes" => {
                "status" => job.status,
                "started-at" => job.started_at,
                "finished-at" => job.finished_at,
                "error-message" => job.error_message,
                "created-at" => job.created_at
            }.merge(job.stats_attributes.dasherize || {}),
            "relationships" => {
                "integration" => {
                    "data" => {"type" => integration.model_type, "id" => integration.id.to_s}
                }
            }
        }
    end

    def serialize_google_integration(integration, extra_attributes = {})
        json = {
            "type" => integration.model_type,
            "id" => integration.id.to_s,
            "attributes" => {
                "enabled" => integration.enabled,
                "syncing" => integration.syncing,
                "last-synced-at" => integration.last_synced_at,
                "project-id" => integration.project_id
            }.merge(extra_attributes)
        }

        if integration.latest_sync_job
            json.merge!(
                {
                    "relationships" => {
                        "latest-sync" => {
                            "data" => {
                                "type" => integration.latest_sync_job.model_type,
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

    def meta_project_ids(google_integration)
        return [] if google_integration.access_token.nil?
        client = Google::Apis::CloudresourcemanagerV1beta1::CloudResourceManagerService.new
        client.authorization = google_integration.access_token
        response = client.list_projects
        if !response.projects.nil? && response.projects.any?
            response.projects.map(&:project_id)
        else
            []
        end
    end

end
