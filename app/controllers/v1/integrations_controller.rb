class V1::IntegrationsController < V1::ApplicationController
    before_action :authenticate

    def index
        # show all integrations
        integrations = current_account.third_party_integrations
        json = {
            "data" => integrations.map do |integration|
                serialize_integration(integration)
            end
        }

        render json: json
    end


    private

    def serialize_integration(integration)
        {
            "type" => integration.model_type,
            "id" => integration.id.to_s,
            "attributes" => {
                "enabled" => integration.enabled,
                "syncing" => integration.syncing,
                "last-synced-at" => integration.last_synced_at
            }
        }
    end

end
