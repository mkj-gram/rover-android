class V1::IosPlatformController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema, only: [:create]
    before_action :check_access, only: [:index, :show, :create, :destroy]
    before_action :set_ios_platform, only: [:show, :destroy]
    def index

    end

    def show
        json = {
            data: serialize_ios_platform(@ios_platform)
        }

        render json: json
    end

    def create

    end

    def destroy

    end

    def resource
        :platform
    end

    private

    def set_ios_platform
        @ios_platform = current_account.ios_platform
        head :not_found if @ios_platform.nil?
        head :not_found if @ios_platform.id.to_s == params[:id].to_s
    end

    def serialize_ios_platform(ios_platform)
        V1::IosPlatformSerializer.serialize(ios_platform)
    end

    def ios_platform_params(local_params)
        local_params.fetch(:ios_platforms, {}).permit(:certificate, :passphrase)
    end

end
