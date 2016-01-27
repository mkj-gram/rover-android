#
# Responsible for displaying all integrations
# uses the param integration_type to determine the type of integration it should be looking for
#
# @author [chrisrecalis]
#
class V1::IntegrationsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema,    only: [:create, :update]

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
                serialize_sync_job(integration, integration.latest_sync_job)
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
                    serialize_sync_job(integration, integration.latest_sync_job)
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

    private

    def build_integration(json)
        # type could come from json
        # or it could come from url
        type = params[:integration_type] || (json[:data].length > 0 ? json[:data].keys[0] : nil)
        case type
        when "estimote-integrations"
            build_estimote_integration(json)
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
        convert_param_if_exists(local_params[:"estimote-integrations"], :"app-id", :app_id)
        convert_param_if_exists(local_params[:"estimote-integrations"], :"app-token", :app_token)
        return local_params[:"estimote-integrations"].permit(:enabled, :app_id, :app_token)
    end



    def get_integrations
        case params[:integration_type]
        when "estimote-integrations"
            EstimoteIntegration.where(account_id: current_account.id).all
        else
            current_account.third_party_integrations
        end
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
                "added-devices-count" => job.added_devices_count,
                "modified-devices-count" => job.modified_devices_count,
                "removed-devices-count" => job.removed_devices_count,
                "devices-changed-configuration-count" => job.devices_changed_configuration_count,
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
