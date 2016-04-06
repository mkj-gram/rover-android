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
                "data" => jobs.map{|job| serialize_sync_job(integration, job)},
                "links" => pagination_links(get_resource_url, jobs)
            }
            render json: json
        else
            head :not_found
        end

    end

    def show
        if @job
            json = {
                "data" => serialize_sync_job(@integration, @job)
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
                    "data" => serialize_sync_job(@integration, @job)
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
    # ids we have estimote_integration_id
    # integration_id
    # kontakt_integration_id
    def get_integration_id
        @integration_id ||= -> {
            id = params[:integration_id] || params[:estimote_integration_id] || params[:kontakt_integration_id] || params[:gimbal_integration_id]
            if id.nil?
                # this request might have the integrations id in the payload
                json = flatten_request({single_record: true})
                id = json.dig(:data, :sync_jobs, :integration_id)
            end
            return id
        }.call
    end

    def get_resource_url
        if params[:estimote_integration_id]
            v1_estimote_integration_sync_jobs_url
        else
            v1_integration_sync_jobs_url
        end
    end

    def set_resource
        @job = ThirdPartyIntegrationSyncJob.find_by_id(params[:id])
        @integration = @job.third_party_integration if @job
    end

end
