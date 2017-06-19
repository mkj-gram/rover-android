#
# Responsible for displaying all integrations
# uses the param integration_type to determine the type of integration it should be looking for
#
# @author [chrisrecalis]
#
class V1::IntegrationsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema,    only: [:create, :update]
    before_action :check_access,            only: [:index, :show, :create, :update, :destroy]

    allow :all, ["admin", "server"]
    
    def index

        # show all integrations
        includes_sync = whitelist_include(["latestSync"]).any?

        integrations = get_integrations


        json = {
            "data" => integrations.map do |integration|
                serialize_integration(integration)
            end
        }

        if includes_sync
            included = integrations.select{|integration| !integration.latest_sync_job.nil? }.map do |integration|
                V1::ThirdPartyIntegrationSyncJobSerializer.serialize_with_integration(integration.latest_sync_job, integration)
            end

            json["included"] = included
        end

        render json: json
    end

    def show
        includes_sync = whitelist_include(["latestSync"]).any?

        integration = ThirdPartyIntegration.find_by_id(params[:id])

        if integration
            json = {
                "data" => serialize_integration(integration)
            }
            if includes_sync
                included = [
                    V1::ThirdPartyIntegrationSyncJobSerializer.serialize_with_integration(integration.latest_sync_job, integration)
                ]
                json["included"] = included
            end

            render json: json
        else
            head :not_found
        end

    end

    def create
        # this could be coming from estimote or kontakt
        json = flatten_request({single_record: true})

        integration = build_integration(json)
        if integration
            if integration.save
                json = {
                    "data" => serialize_integration(integration)
                }

                json["included"] = [V1::ThirdPartyIntegrationSyncJobSerializer.serialize_with_integration(integration.latest_sync_job, integration)] if integration.latest_sync_job

                render json: json, status: :created
            else
                render json: {errors: V1::ThirdPartyIntegrationsModelError.serialize(integration.errors)}, status: :unprocessable_entity
            end
        else
            render json: { errors: [{detail: "type unrecognized", source: {pointer: "/data"}}]}, status: :unprocessable_entity
        end
    end

    def destroy
        integration = ThirdPartyIntegration.find_by_id(params[:id])
        if integration
            integration.destroy
            head :no_content
        else
            head :not_found
        end
    end

    def reosurce
        ThirdPartyIntegration
    end

    private

    def build_integration(json)
        # type could come from json
        # or it could come from url
        type = params[:integration_type] || (json[:data].length > 0 ? json[:data].keys[0] : nil)
        case type
        when "estimote-integrations"
            build_estimote_integration(json)
        when "kontakt-integrations"
            build_kontat_integration(json)
        when "gimbal-integrations"
            build_gimbal_integration(json)
        when "xenio-integrations"
            build_xenio_integration(json)
        else
            nil
        end

    end

    def build_estimote_integration(json)
        options = estimote_integration_params(json[:data])
        app_id = options.delete(:app_id)
        app_token = options.delete(:app_token)
        integration = EstimoteIntegration.new(options)
        integration.set_credentials(app_id, app_token)
        integration.account_id = current_account.id
        return integration
    end

    def estimote_integration_params(local_params)
        return local_params[:estimote_integrations].permit(:enabled, :app_id, :app_token)
    end

    def build_kontat_integration(json)
        options = kontakt_integration_params(json[:data])
        api_key = options.delete(:api_key)
        integration = KontaktIntegration.new(options)
        integration.set_credentials(api_key)
        integration.account_id = current_account.id
        return integration
    end

    def kontakt_integration_params(local_params)
        return local_params[:kontakt_integrations].permit(:enabled, :api_key)
    end

    def build_gimbal_integration(json)
        options = gimbal_integration_params(json[:data])
        api_key = options.delete(:api_key)
        integration = GimbalIntegration.new(options)
        integration.api_key = api_key
        integration.account_id = current_account.id
        return integration
    end

    def gimbal_integration_params(local_params)
        return local_params[:gimbal_integrations].permit(:enabled, :api_key)
    end

    def build_xenio_integration(json)
        options = xenio_integration_params(json[:data])
        integration = XenioIntegration.new(options)
        integration.account_id = current_account.id
        return integration
    end

    def xenio_integration_params(local_params)
        return local_params.fetch(:xenio_integrations, {}).permit(:enabled, :customer_id)
    end

    def get_integrations
        case params[:integration_type]
        when :estimote_integrations
            EstimoteIntegration.where(account_id: current_account.id).all
        else
            current_account.third_party_integrations
        end
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
end
