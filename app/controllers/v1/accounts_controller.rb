class V1::AccountsController < V1::ApplicationController

    before_action :authenticate
    before_action :has_access_to_account
    before_action :check_access, only: [:show, :update]

    # GET /accounts/:id
    def show
        json = {
            "data" => {
                "id" => current_account.id.to_s,
                "type" => "accounts",
                "attributes" => {
                    "title" => current_account.title,
                    "token" => current_account.token,
                    "subdomain" => current_account.subdomain,
                    "share-key" => current_account.share_key,
                    "configuration-tags" => current_account.beacon_configuration_active_tag.tags,
                    "place-tags" => current_account.place_active_tag.tags,
                    "xenio-zone-tags" => current_account.xenio_zone_active_tag.tags,
                    "xenio-place-tags" => current_account.xenio_place_active_tag.tags,
                    "ibeacon-uuids" => current_account.ibeacon_configuration_uuids.configuration_uuids,
                    "eddystone-namespaces" => current_account.eddystone_namespace_configuration_uuids.configuration_uuids,
                    "is-gimbal-enabled" => current_account.gimbal_integrations.count >= 1,
                    "message-limits" => current_account.message_limits.map{|limit| V1::MessageLimitSerializer.serialize(limit)}
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

        gimbal_integration = current_account.gimbal_integrations.first
        if gimbal_integration
            json["data"]["relationships"].merge!(
                {
                    "gimbal-integration" => {
                        "data" => {
                            "type" => "gimbal-integrations",
                            "id" => gimbal_integration.id.to_s
                        }
                    }
                }
            )
        end

        google_integration = current_account.google_integration
        if google_integration
            json["data"]["relationships"].merge!(
                {
                    "google-integration" => {
                        "data" => {
                            "type" => "google-integrations",
                            "id" => google_integration.id.to_s
                        }
                    }
                }
            )
        end



        ios_platform = current_account.ios_platform
        if ios_platform
            json["data"]["relationships"].merge!(
                {
                    "ios-platform" => {
                        "data" => {
                            "type" => "ios-platforms",
                            "id" => ios_platform.id.to_s
                        }
                    }
                }
            )
        end

        android_platform = current_account.android_platform
        if android_platform
            json["data"]["relationships"].merge!(
                {
                    "android-platform" => {
                        "data" => {
                            "type" => "android-platforms",
                            "id" => android_platform.id.to_s
                        }
                    }
                }
            )
        end

        included = [estimote_integration, kontakt_integration, gimbal_integration, google_integration].compact.map do |integration|
            serialize_integration(integration)
        end

        included += [estimote_integration, kontakt_integration, gimbal_integration, google_integration].compact.select{|integration| !integration.latest_sync_job.nil? }.map do |integration|
            V1::ThirdPartyIntegrationSyncJobSerializer.serialize_with_integration(integration.latest_sync_job, integration)
        end

        included += [V1::AndroidPlatformSerializer.serialize(android_platform)] if android_platform
        included += [V1::IosPlatformSerializer.serialize(ios_platform)] if ios_platform

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

    def resource
        Account
    end

    private

    def has_access_to_account
        if current_account.id.to_s != params[:id].to_s
            head :forbidden
        end
    end

    def account_params(local_params)
        param_should_be_array(local_params[:accounts], :message_limits)
        local_params.require(:accounts).permit(:title, :subdomain, {:message_limits => [:message_limit, :number_of_minutes, :number_of_hours, :number_of_days]})
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
                            "type" => integration.latest_sync_job.model_type,
                            "id" => integration.latest_sync_job.id.to_s
                        }
                    }
                }
            )
        end

        return json
    end
end
