class V1::IosPlatformsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema, only: [:update]
    before_action :check_access, only: [:show, :update]
    before_action :set_ios_platform, only: [:show, :update]


    def show
        json = {
            data: serialize_ios_platform(@ios_platform)
        }

        render json: json
    end

    def update
        
        json = flatten_request({single_record: true})

        if @ios_platform.update(ios_platform_params(json[:data]))
            json = {
                data: serialize_ios_platform(@ios_platform)
            }
            render json: json
        else
            render json: { errors: V1::IosPlatformErrorSerializer.serialize(@ios_platform.errors)}, status: :unprocessable_entity
        end
    end

    def resource
        :platform
    end

    private

    def set_ios_platform
        @ios_platform = current_account.ios_platform
        head :not_found if @ios_platform.nil?
        head :not_found if @ios_platform.id.to_s != params[:id].to_s
    end

    def serialize_ios_platform(ios_platform)
        V1::IosPlatformSerializer.serialize(ios_platform)
    end

    def ios_platform_params(local_params)
        convert_param_if_exists(local_params[:ios_platforms], :name, :title)
        local_params.fetch(:ios_platforms, {}).permit(:title, :app_id_prefix, :app_store_id)
    end

end
