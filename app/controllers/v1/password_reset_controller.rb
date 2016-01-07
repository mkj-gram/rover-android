class V1::PasswordResetController < V1::ApplicationController

    # before_action :validate_json_schema,    only: [:create]

    #
    # This will destroy the old model and create a new one
    #
    # @return [type] [description]
    def create
        # @password_reset = PasswordReset.new(password_reset_params)
        # if @password_reset.save
        #     render json: @password_reset, status: :created
        # else
        #     render json: @password_reset.errors, status: :unprocessable_entity
        # end
    end

    def update
        # token = params[:password_reset][:token]
        # @password_reset = PasswordReset.find_by_token(token)
        # if @password_reset.expires_at <= DateTime.now
        #     password = params[:password_reset][:password]
        #     password_confirmation = params[:password_reset][:password_confirmation]
        #     @password_reset.reset_password!(password, password_confirmation)
        # else
        #     render json: {errors: ["Password reset link has expired"]}
        # end
    end

    private

    def password_reset_params
        # params.require(:password_reset).permit(:email)
    end
end

# I'm going to visit
# rover.io/password/reset/jk12j3did91d913
# this is going to ask the api at v1/password/reset/ajdj1i1n1j update?
