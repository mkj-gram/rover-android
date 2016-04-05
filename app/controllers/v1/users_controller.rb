class V1::UsersController < V1::ApplicationController

    before_action :authenticate,            except: [:create]
    before_action :validate_json_schema,    only: [:create, :update]
    before_action :set_resource,            only: [:show, :update, :destroy]
    before_action :check_access,            only: [:index, :show, :update, :destroy]

    # GET /users
    # Returns paged user's who belong to an account
    def index
        @users = current_account.users.order("id").where("id >= ?", current_cursor).limit(page_size + 1)
        next_cursor = get_next_cursor(@users, "id")
        # trim it since we included 1 extra record
        @users = @users.first(page_size)
        json = {
            "data" => @users.map{|user| V1::UserSerializer.s(user)},
            "meta" => {
                "total_records"=> current_account.users_count
            },
            "links" => {
                "next" => next_cursor.nil? ? nil : v1_users_url({"page[cursor]" => next_cursor})
            }
        }
        render json: json
    end

    # GET /users/1
    #
    def show
        if @user
            json = {
                "data" => {
                    "type" => "users",
                    "id" => @user.id.to_s,
                    "attributes" => {
                        "name" => @user.name,
                        "email" => @user.email
                    },
                    "relationships" => {
                        "account" => {
                            "data" => { "type" => "account", "id" => @user.account.id.to_s }
                        }
                    }
                }
            }
            render json: json
        else
            head :not_found
        end

    end


    # PATCH/PUT /users/1
    # Non batch request
    def update
        # when updating we need to validate the user?
        json = flatten_request({single_record: true})
        local_params = user_params(json[:data])
        if @user.update(user_params(json[:data]))
            json = {
                "data" => {
                    "type" => "users",
                    "id" => @user.id.to_s,
                    "attributes" => {
                        "name" => @user.name,
                        "email" => @user.email,
                        "current-password" => "",
                        "password" => ""
                    },
                    "relationships" => {
                        "account" => {
                            "data" => { "type" => "account", "id" => @user.account.id.to_s }
                        }
                    }
                }
            }
            render json: json
        else
            render json: {errors: V1::UserUpdateErrorSerializer.serialize(@user.errors)}, status: :unprocessable_entity
        end
    end

    # DELETE /users/1
    # DELETE /users/1.json
    def destroy
        @user
        if @user.destroy
            head :no_content
        else
            render_errors(@user.errors, stautus: :conflict)
        end
    end

    def resource
        User
    end

    private

    def set_resource
        user = User.find_by_id(params[:id])
        @user = user
        # set_current_resources(user)
    end

    def check_access
        if action_name != "index" && current_user.id == @user.id
            return true
        else
            super
        end
    end

    def user_params(local_params)
        local_params.require(:users).permit(:name, :email, :password, :password_confirmation, :current_password)

    end
end
