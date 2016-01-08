class V1::PasswordResetController < V1::ApplicationController

    before_action :validate_json_schema,    only: [:create]

    #
    # This will destroy the old model and create a new one
    #
    # @return [type] [description]
    def create
        json = flatten_request({single_record: true})
        @password_reset = PasswordReset.new(password_reset_params(json[:data]))
        if @password_reset.save
            json = {
                "data" => {
                    "id" => @password_reset.id.to_s,
                    "type" => "password_resets",
                    "attributes" => {
                        "email" => @password_reset.email,
                        "expires_at" => @password_reset.expires_at
                    }
                }
            }
            render json: json, status: :created
        else
            render json: @password_reset.errors, status: :unprocessable_entity
        end
    end

    private

    def password_reset_params(local_params)
        local_params.require(:password_resets).require(:email)
        local_params.require(:password_resets).permit(:email)
    end
end

# I'm going to visit
# rover.io/password/reset/jk12j3did91d913
# this is going to ask the api at v1/password/reset/ajdj1i1n1j update?
