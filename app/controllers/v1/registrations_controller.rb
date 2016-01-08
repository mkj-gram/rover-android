class V1::RegistrationsController < V1::ApplicationController

    before_action :validate_json_schema


    # POST /users
    # non batch request
    def create
        json = flatten_request({single_record: true})
        @user = User.new(user_params(json[:data]))
        # when a user is first created generate a session for them?
        if @user.save
            json = {
                "data"=> {
                    "id"=> @user.id,
                    "type"=> "registrations",
                    "attributes"=> {},
                    "relationships"=> {
                        "user" => {
                            "data" => {
                                "id" => @user.id,
                                "type" => "users"
                            }
                        },
                        "account" => {
                            "data" => {
                                "id" => @user.account_id,
                                "type" => "accounts"
                            }
                        },
                        "session" => {
                            "data" => {
                                "id" => @user.session.id,
                                "type" => "sessions"
                            }
                        }
                    }
                },
                "included"=> [
                    V1::UserSerializer.s(@user),
                    V1::AccountSerializer.s(@user.account),
                    V1::SessionSerializer.s(@user.session)
                ]
            }
            render json: json, location: v1_user_url(@user.id)
        else
            render_errors(@user.errors, status: :unprocessable_entity)
        end
    end



    private


    def user_params(local_params)
        local_params.require(:registrations).permit(:name, :email, :password, :password_confirmation, :account_title, :account_invite_token)
    end
end
