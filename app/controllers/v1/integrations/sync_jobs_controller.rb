class V1::Integrations::SyncJobsController < V1::ApplicationController
    before_action :authenticate
    before_action :set_resource, only: [:show]
    def show
        if @job
            json = {
                "data" => {
                    "type" => "integrations-sync-jobs",
                    "id" => @job.id.to_s,
                    "attributes" => {
                        "status" => @job.status,
                        "started-at" => @job.started_at,
                        "finished-at" => @job.finished_at,
                        "error-message" => @job.error_message,
                    },
                    "relationships" => {
                        "integration" => {
                            "data" => {type: @integration.model_type, "id" => @integration.id.to_s}
                        }
                    }
                }
            }

            render json: json
        else
            head :not_found
        end
    end

    def create
        @integration = ThirdPartyIntegration.find_by_id(get_integration_id)
        if @integration
            p "creating job"
            if @integration.create_sync_job!
                @job = @integration.job
                json = {
                    "data" => {
                        "type" => "integrations-sync-jobs",
                        "id" => @job.id.to_s,
                        "attributes" => {
                            "status" => @job.status,
                            "started-at" => @job.started_at,
                            "finished-at" => @job.finished_at,
                            "error-message" => @job.error_message,
                        },
                        "relationships" => {
                            "integration" => {
                                "data" => {type: @integration.model_type, "id" => @integration.id.to_s}
                            }
                        }
                    }
                }
                render json: json, status: :created
            else
                render json: {errors: [{title: "conflict", detail: "A job is already running", source: {pointer: "data"}}]}, status: :conflict
            end
        else
            head :not_found
        end
    end


    private

    # ids we have estimote_integration_id
    # integration_id
    # kontakt_integration_id
    def get_integration_id
        @integration_id ||= params[:integration_id] || params[:estimote_integration_id]
    end

    def set_resource
        @job = ThirdPartyIntegrationSyncJob.find_by_id(params[:id])
        @integration = @job.third_party_integration if @job
    end

end
