class V1::SessionsController < V1::ApplicationController
    before_action :validate_json_schema,    only: [:create]

    def create
        # takes in a email and password and returns a signed jwt token
        json = flatten_request({single_record: true})
        login_params = session_params(json[:data])
        @user = User.find_by_email(login_params[:email])
        if @user && @user.authenticate(login_params[:password])
            @session = Session.build_session(@user)
            if @session.save
                json = {
                    "data"=> {
                        "id"=> @session.id.to_s,
                        "type"=> "sessions",
                        "attributes"=> {
                            "token"=> @session.token
                        },
                        "relationships"=> V1::UserSerializer.s(@session.user, {relationships: true})
                    },
                    "included"=> [
                        V1::UserSerializer.s(@session.user).merge!(
                            {
                                "relationships" => V1::AccountSerializer.s(@session.user.account, {relationships: true})
                            }
                        )
                    ]
                }
                render json: json, location: v1_user_url(@session.user.id)
            else
                render_errors(@session.errors)
            end
        else
            render_unauthorized("Validation Error", "Incorrect email or password")
        end

    end

    def destroy
        # add in later for the admin console
        # stateless? discussion
        # if we keep state we can expire keys
    end

    private

    def session_params(local_params)
        local_params.require(:sessions).require(:email)
        local_params.require(:sessions).require(:password)
        local_params.require(:sessions).permit(:email, :password)
    end
end
