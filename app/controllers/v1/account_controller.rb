class V1::AccountController < V1::ApplicationController

    before_action :authenticate

    # GET /account/
    def show
        json = {
            "data" => {
                "id" => current_account.id.to_s,
                "type" => "accounts",
                "attributes" => {
                    "title" => current_account.title,
                    "token" => current_account.token,
                    "share_key" => current_account.share_key
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

    def account_params(local_params)
        local_params.require(:accounts).permit(:title)
    end
end
