class V1::SessionsController < V1::ApplicationController

    before_action :validate_json_schema,    only: [:create]
    before_action :authenticate,            only: [:show, :destroy]

    def create
        # takes in a email and password and returns a signed jwt token
        json = flatten_request({single_record: true})
        login_params = session_params(json[:data])
        @user = User.find_by_email(login_params.fetch(:email, "").downcase)
        if @user && @user.authenticate(login_params.fetch(:password, ""))
            @session = Session.build_session(@user)
            if @session.save

                json = render_session(@session)        

                render json: json, location: v1_user_url(@session.user.id)
            else
                render_errors(@session.errors)
            end
        else
            render_unauthorized("Validation Error", "Incorrect email or password")
        end

    end

    def show
        @session = Session.find_by_id(params[:id])
        if @session
            if current_user && @session.user_id != current_user.id
                render_unauthorized("Validation Error", "unable to view a session which isn't yours")
            else
               json = render_session(@session)
               
                render json: json, location: v1_user_url(@session.user.id)
            end
        else
            head :not_found
        end
    end

    def destroy
        @session = Session.find_by_id(params[:id])
        if @session
            if current_user && @session.user_id != current_user.id
                render_unauthorized("access", "you do not have access to delete this session")
            elsif current_account && @session.account_id != current_account.id
                render_unauthorized("access", "you do not have access to delete this session")
            else
                if @session.expire!
                    head :no_content
                else
                    render_errors(@session.errors, stautus: :conflict)
                end
            end
        else
            head :not_found
        end
    end

    private

    def render_session(session)
        json = {
            "data" => {
                "id" => session.id.to_s,
                "type" => "sessions",
                "attributes"=> {
                    "token"=> session.token
                },
                "relationships"=> {
                    "user" => {
                        "data" => { "type" => "users", "id" => session.user.id.to_s }
                    },
                    "account" => {
                        "data" => { "type" => "accounts", "id" => session.user.account.id.to_s }
                    }                        
                }
            }
        }
    end

    def session_params(local_params)
        local_params.require(:sessions).permit(:email, :password)
    end
end