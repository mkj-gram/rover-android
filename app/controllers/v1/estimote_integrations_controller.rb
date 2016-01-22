class V1::EstimoteIntegrationsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema,    only: [:create, :update]
    before_action :set_resource,            only: [:show, :update, :destroy]

    def show
        json = {
            "data" => {
                "type" => EstimoteIntegration.model_type_pluralized,
                "id" => @integration.id.to_s,
                "attributes" => {
                    "enabled" => @integration.enabled,
                    "syncing" => @integration.syncing,
                    "last-synced-at" => @integration.last_synced_at,
                    "app-id" => @integration.app_id,
                    "app-token" => @integration.app_token
                }
            }
        }

        render json: json
    end

    def create
        json = flatten_request({single_record: true})
        options = integration_params(json[:data])
        app_id = options.delete(:app_id)
        app_token = options.delete(:app_token)
        @integration = EstimoteIntegration.new(options)
        @integration.set_credentials(app_id, app_token)
        @integration.account_id = current_account.id

        if @integration.save
            json = {
                "data" => {
                    "type" => EstimoteIntegration.model_type_pluralized,
                    "id" => @integration.id.to_s,
                    "attributes" => {
                        "enabled" => @integration.enabled,
                        "syncing" => @integration.syncing,
                        "last-synced-at" => @integration.last_synced_at,
                        "app-id" => @integration.app_id,
                        "app-token" => @integration.app_token
                    }
                }
            }
            render json: json, status: :created
        else
            render json: {errors: V1::EstimoteIntegrationModelError.serialize(@integration.errors)}, status: :unprocessable_entity
        end
    end

    def update
        json = flatten_request({single_record: true})
        if @integration.update(integration_params(json[:data]))
            head :no_content
        else
            render json: {errors: V1::EstimoteIntegrationModelError.serialize(@integration)}, status: :unprocessable_entity
        end
    end

    def destroy
        if @integration.destroy
            head :no_content
        else
            render_errors(@user.errors, stautus: :conflict)
        end
    end

    private

    def set_resource
        @integration = EstimoteIntegration.find_by_id(params[:id])
        if @integration.nil?
            head :not_found
        end
    end

    def integration_params(local_params)
        # local_params.require(:"estimote-integrations")

        convert_param_if_exists(local_params[:"estimote-integrations"], :"app-id", :app_id)
        convert_param_if_exists(local_params[:"estimote-integrations"], :"app-token", :app_token)

        # local_params.require(:"estimote-integrations").permit(:enabled, :app_id, :app_token)
        return local_params[:"estimote-integrations"].permit(:enabled, :app_id, :app_token)
    end


end
