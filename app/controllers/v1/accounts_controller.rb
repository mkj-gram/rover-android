class V1::AccountsController < V1::ApplicationController

    before_action :authenticate
    before_action :has_access_to_account
    # GET /accounts/:id
    def show
        json = {
            "data" => {
                "id" => current_account.id.to_s,
                "type" => "accounts",
                "attributes" => {
                    "title" => current_account.title,
                    "token" => current_account.token,
                    "share-key" => current_account.share_key,
                    "configuration-tags" => current_account.beacon_configuration_active_tags_index.tags
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

    private
    def has_access_to_account
        # if current_account.id != params[:id]
        #     head :unauthorized
        # end
    end
    def account_params(local_params)
        local_params.require(:accounts).permit(:title)
    end
end
