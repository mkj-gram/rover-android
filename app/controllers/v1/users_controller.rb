class V1::UsersController < V1::ApplicationController

    before_action :authenticate,            except: [:create]
    before_action :validate_json_schema,    only: [:create, :update]
    before_action :set_resource,            only: [:show, :update, :destroy]
    before_action :check_access,            only: [:index, :show, :update, :destroy]

    # GET /users
    # Returns paged user's who belong to an account
    def index
        @users = current_account.users.order(whitelist_order(["id", "created_at"], "id")).paginate(page: current_page, per_page: page_size, total_entries: current_account.users_count)
        render json: @users, each_serializer: V1::UserSerializers::IndividualSerializer
    end

    # GET /users/1
    #
    def show
        @user = current_resource
        if @user
            render json: @user, serializer: V1::UserSerializers::IndividualSerializer
        else
            head :not_found
        end

    end

    # POST /users
    # non batch request
    def create
        json = flatten_request({single_record: true})
        @user = User.new(user_params(json[:data]))
        # when a user is first created generate a session for them?
        if @user.save
            render json: @user, serializer: V1::UserSerializers::CreateSerializer, include: ["session"], location: v1_user_url(1)
        else
            render_errors(@user.errors, status: :unprocessable_entity)
        end
    end

    # PATCH/PUT /users/1
    # Non batch request
    def update
        json = flatten_request({single_record: true})
        @user = current_resource
        if @user.update(user_params(json[:data]))
            head :no_content
        else
            render_errors(@user.errors, status: :unprocessable_entity)
        end
    end

    # DELETE /users/1
    # DELETE /users/1.json
    def destroy
        @user = current_resource
        if @user.destroy
            head :no_content
        else
            render_errors(@user.errors, stautus: :conflict)
        end
    end

    private

    def set_resource
        user = User.find_by_id(params[:id])
        set_current_resources(user)
    end


    def user_params(local_params)
        local_params.require(:user).permit(:name, :email, :password, :password_confirmation, :account_title, :account_invite_token)
    end
end
