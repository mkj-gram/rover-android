class V1::AndroidPlatformController < V1::ApplicationController

    before_action :authenticate
    before_action :validate_json_schema, only: [:create]
    before_action :check_access, only: [:index, :show, :create, :destroy]
    before_action :set_android_platform, only: [:show, :destroy]

    def show
        json = {
            data: serialize_android_platform(@android_platform)
        }

        render json: json
    end

    def create
        json = flatten_request({single_record: true})
        android_platform = current_account.android_platform.build(local_params(json[:data]))
        if android_platform.save
            json = {
                data: serialize_android_platform(android_platform)
            }
            render json: json
        else
            render json: { errors: V1::AndroidPlatformErrorSerializer.serialize(android_platform.errors)}, status: :unprocessable_entity
        end
    end

    def destroy
        if android_platform.destroy
            head :no_content
        else
            render json: { errors: V1::AndroidPlatformErrorSerializer.serialize(android_platform.errors)}, status: :unprocessable_entity
        end
    end

    def resource
        Platform
    end

    private

    def set_android_platform
        @android_platform = current_account.android_platform
        head :not_found if @android_platform.nil?
        head :not_found if @android_platform.id.to_s == params[:id].to_s
    end

    def serialize_android_platform(android_platform)
        V1::androidPlatformSerializer.serialize(android_platform)
    end

    def android_platform_params(local_params)
        local_params.fetch(:android_platforms, {}).permit(:package_name, :api_key)
    end

end
