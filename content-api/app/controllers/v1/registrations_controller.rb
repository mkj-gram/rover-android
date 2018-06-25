class V1::RegistrationsController < V1::ApplicationController

  before_action :validate_json_schema


  # POST /users
  # non batch request
  def create
    if USE_SVC
      svc_create
      return
    end

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

  def svc_create
    req_json = flatten_request({single_record: true})

    json, ok = svc_create_user(user_params(req_json[:data]))
    if ok
      render json: json, location: v1_user_url(@user.id)
    else
      render json: json , status: :unprocessable_entity
    end
  end

  private

  def svc_create_user(usr_params)

    title = usr_params[:account_title]
    subdomain = Account.unique_domain(Account.sanitize_domain(title))

    @user = User.new(usr_params)
    @acct = Account.new(title: title, subdomain: subdomain)

    if !@user.valid?
      json = { errors: V1::RegistrationErrorSerializer.serialize(@user.errors) }
      return [json, false]
    end

    if !@acct.valid?
      json = { errors: V1::RegistrationErrorSerializer.serialize(@acct.errors) }
      return [json, false]
    end

    auth, api = AUTHSVC_CLIENT, Rover::Auth::V1

    # TODO: perform account & user creation in transaction in authsvc
    acct = auth.create_account(api::CreateAccountRequest.new(
      name: title,
      account_name: subdomain,
    ))

    usr = auth.create_user(api::CreateUserRequest.new(
      account_id: acct.id,
      name: usr_params[:name],
      email: usr_params[:email],
      password: usr_params[:password],
    ))

    # create an account with the primary email as the first user to sign up
    # link user and account
    @acct.id = usr.account_id
    @acct.primary_user_id = usr.id

    if !@acct.save
      json = { errors: V1::RegistrationErrorSerializer.serialize(@acct.errors) }
      return [json, false]
    end

    # link users
    @user.id = usr.id
    @user.account_owner = true
    @user.account = @acct

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

      [json, true]
    else
      json = { errors: V1::RegistrationErrorSerializer.serialize(@user.errors) }
      [json, false]
    end
  end


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
