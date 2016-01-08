class V1::AccountController < V1::ApplicationController

    before_action :authenticate
    before_action :set_resource

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
        if current_account.update(account_params)
            head :no_content
        else
            render json: @account.errors, status: :unprocessable_entity
        end
    end

    # DELETE /accounts/1
    # DELETE /accounts/1.json
    def destroy
        @account.destroy
        head :no_content
    end

    private

    def account_params
        params.require(:account).permit(:title)
    end
end
