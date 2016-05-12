class V1::PasswordResetsController < V1::ApplicationController

    before_action :validate_json_schema,    only: [:create, :update]

    def index
        # this has a query param as token
        token = params[:token]
        @password_reset = PasswordReset.where(token: params[:token])
        if @password_reset && !@password_reset.expired?
            json = {
                "data" => {
                    "id" => @password_reset.id.to_s,
                    "type" => "password-resets",
                    "attributes" => {
                        "email" => @password_reset.email
                    }
                }
            }
            render json: json
        else
            head :not_found
        end
    end

    #
    # This will destroy the old model and create a new one
    #
    # @return [type] [description]
    def create
        json = flatten_request({single_record: true})
        @password_reset = PasswordReset.new(password_reset_create_params(json[:data]))
        if @password_reset.save
            json = {
                "data" => {
                    "id" => @password_reset.id.to_s,
                    "type" => "password-resets",
                    "attributes" => {
                        "email" => @password_reset.email
                    }
                }
            }
            render json: json, status: :created
        else
            render json: { errors: V1::PasswordResetErrorSerializer.serialize(@password_reset.errors) }, status: :unprocessable_entity
        end
    end


    #
    # Update the password reset with a new password
    #
    def update
        json = flatten_request({single_record: true})
        @password_reset = PasswordReset.where(id: params[:id])
        if @password_reset && !@password_reset.expired?
            local_params = password_reset_update_params(json[:data])
            if @password_reset.token == local_params.fetch(:token, "")
                new_password = local_params.fetch(:password, nil)
                if new_password.nil?
                    render json: { errors: [{ detail: "can't be blank", source: {pointer: "data/attributes/password"}}]}, status: :unprocessable_entity
                else
                    if @password_reset.reset_password(new_password)
                        head :no_content
                    else
                        render json: { errors: V1::PasswordResetErrorSerializer.serialize(@password_reset.user.errors) }, status: :unprocessable_entity
                    end
                end
            else
                head :bad_request
            end
        else
            head :not_found
        end

    end

    private

    def password_reset_create_params(local_params)
        local_params.require(:password_resets)
        local_params.require(:password_resets).permit(:email)
    end

    def password_reset_update_params(local_params)
        local_params.require(:password_resets)
        local_params.require(:password_resets).permit(:token, :password)
    end
end

# I'm going to visit
# rover.io/password/reset/jk12j3did91d913
# this is going to ask the api at v1/password/reset/ajdj1i1n1j update?
