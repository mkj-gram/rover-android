class V1::Integrations::SyncJobsController < V1::ApplicationController

    before_action :authenticate
    before_action :set_resource, only: [:show]
    before_action :validate_json_schema,    only: [:create]

    def index
        integration = ThirdPartyIntegration.find_by_id(get_integration_id)
        if integration
            orders = whitelist_order(["created_at", "started_at", "finished_at"], [], {order: "DESC"})
            if orders.empty?
                orders = ["id DESC"]
            else
                orders.map!{|order| order.concat(" ").concat(" NULLS LAST")}
            end

            jobs = integration.sync_jobs.paginate(per_page: page_size, page: current_page, total_entries: integration.third_party_integration_sync_jobs_count).order(orders.join(","))

            json = {
                "data" => jobs.map{|job| V1::ThirdPartyIntegrationSyncJobSerializer.serialize_with_integration(job, integration) }
            }
            render json: json
        else
            head :not_found
        end

    end

    def show
        if @job
            json = {
                "data" => V1::ThirdPartyIntegrationSyncJobSerializer.serialize_with_integration(@job, @integration)
            }
            render json: json
        else
            head :not_found
        end
    end

    def create
        @integration = ThirdPartyIntegration.find_by_id(get_integration_id)
        if @integration
            if @integration.create_sync_job!
                @job = @integration.job
                json = {
                    "data" => V1::ThirdPartyIntegrationSyncJobSerializer.serialize_with_integration(@job, @integration)
                }
                render json: json, status: :created
            else
                render json: {errors: [{title: "conflict", detail: "A job is already running", source: {pointer: "data"}}]}, status: :unprocessable_entity
            end
        else
            head :not_found
        end
    end


    private

    def get_integration_id
        @integration_id ||= -> {
            id = params[:integration_id] || params[:estimote_integration_id] || params[:kontakt_integration_id] || params[:gimbal_integration_id] || params[:google_integration_id]
            if id.nil?
                # this request might have the integrations id in the payload
                json = flatten_request({single_record: true})
                id = json.dig(:data, :sync_jobs, :integration_id)
                
                if id.nil?
                    id = json.dig(:data, :beacon_sync_jobs, :integration_id)
                end

                if id.nil?
                    id = json.dig(:data, :google_sync_jobs, :integration_id)
                end

            end
            return id
        }.call
    end

    def set_resource
        @job = ThirdPartyIntegrationSyncJob.find_by_id(params[:id])
        @integration = @job.third_party_integration if @job
    end

end
