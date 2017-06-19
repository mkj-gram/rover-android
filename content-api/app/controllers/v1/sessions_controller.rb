class V1::SessionsController < V1::ApplicationController

    before_action :validate_json_schema,    only: [:create]
    before_action :authenticate,            only: [:show, :destroy]

    allow :admin, :server, only: [:show, :destroy]

    def create
      if USE_SVC
        svc_create
        return
      end

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

    def svc_create
      # takes in a email and password and returns a signed jwt token
      json = flatten_request({single_record: true})
      login_params = session_params(json[:data])

      email = login_params.fetch(:email, "").downcase
      password = login_params.fetch(:password, "")
      # TODO:
      last_IP = ""

      usr_sess = create_session(email: email, password: password, last_seen_IP: last_IP)
      if usr_sess.nil?
        render_unauthorized("Create session", "Incorrect email or password")
        return
      end

      @user = User.find_by_id(usr_sess.user_id)
      if @user.nil?
        render_unauthorized("User", "Incorrect email or password")
        return
      end

      @session = Session.new(account_id: @user.account_id, user_id: @user.id)
      @session.token = JWTToken.build_token(@session, jti: usr_sess.key)
      @session.expires_at = Time.zone.at(usr_sess.expires_at.seconds)
      @session.last_seen_at = Time.zone.at(usr_sess.updated_at.seconds)

      if @session.save
        json = render_session(@session)
        render json: json, location: v1_user_url(@session.user.id)
      else
        render_errors(@session.errors)
      end
    end

    def create_session(email:, password:, last_seen_IP: "")
      auth, api = AUTHSVC_CLIENT, Rover::Auth::V1

      usr_session = auth.create_user_session(api::CreateUserSessionRequest.new(
        email: email,
        password: password,
        last_seen_IP: last_seen_IP,
      ))
    rescue GRPC::Unauthenticated, GRPC::NotFound => e
      logger.debug("#{e.class.name}: #{e.message}")
      nil
    end

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
