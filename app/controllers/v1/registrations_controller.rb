class V1::RegistrationsController < V1::ApplicationController

    before_action :validate_json_schema


    # POST /users
    # non batch request
    def create
        json = flatten_request({single_record: true})
        @user = User.new(user_params(json[:data]))
        if @user.save
            json = {
                "data"=> {
                    "id"=> @user.id.to_s,
                    "type"=> "registrations",
                    "attributes"=> {
                        "name" => @user.name,
                        "email" => @user.email,
                        "organization" => @user.account.title
                    }
                }
            }
            render json: json, location: v1_user_url(@user.id)
        else
            json = { errors: V1::RegistrationErrorSerializer.serialize(@user.errors) }
            render json: json , status: :unprocessable_entity
        end
    end

    private


    def user_params(local_params)
        local_params.require(:registrations)

        # format the clients request to server variables
        registration_params = local_params[:registrations]
        registration_params[:password_confirmation] = registration_params[:password]
        registration_params[:account_title] = registration_params[:organization].nil? ? registration_params[:name] : registration_params[:organization]
        registration_params[:account_invite_token] = registration_params[:token].nil? ? nil : registration_params[:token]

        local_params.require(:registrations).permit(:name, :email, :password, :password_confirmation, :account_title, :account_invite_token)

    end
end
