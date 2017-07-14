class V1::AndroidPlatformsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema, only: [:create, :update]
    before_action :check_access, only: [:index, :show, :create, :update, :destroy]
    before_action :set_android_platform, only: [:show, :update, :destroy]

    allow :admin, :server
    
    def show
        json = {
            data: serialize_android_platform(@android_platform)
        }

        render json: json
    end

    def create
        json = flatten_request({single_record: true})
        android_platform = current_account.build_android_platform(android_platform_params(json[:data]))
        if android_platform.save
            json = {
                data: serialize_android_platform(android_platform)
            }
            render json: json
        else
            render json: {errors: V1::AndroidPlatformErrorSerializer.serialize(android_platform.errors)}, status: :unprocessable_entity
        end
    end

    def update
        json = flatten_request({single_record: true})
        if @android_platform.update_attributes(android_platform_params(json[:data]))
            json = {
                data: serialize_android_platform(@android_platform)
            }
            render json: json
        else
            render json: {errors: V1::AndroidPlatformErrorSerializer.serialize(@android_platform.errors)}, status: :unprocessable_entity
        end
    end


    def destroy
        if @android_platform.destroy
            head :no_content
        else
            render json: {errors: V1::AndroidPlatformErrorSerializer.serialize(android_platform.errors)}, status: :unprocessable_entity
        end
    end

    def resource
        :platform
    end

    private

    def set_android_platform
        @android_platform = current_account.android_platform
        head :not_found if @android_platform.nil?
        head :forbidden if @android_platform.id.to_s != params[:id].to_s
    end

    def serialize_android_platform(android_platform)
        V1::AndroidPlatformSerializer.serialize(android_platform)
    end

    def android_platform_params(local_params)
        param_should_be_array(local_params[:android_platforms], :sha256_cert_fingerprints)
        convert_param_if_exists(local_params[:android_platforms], :name, :title)
        local_params.fetch(:android_platforms, {}).permit(:api_key, :sender_id, :messaging_token, :title, :package_name, { :sha256_cert_fingerprints => [] })
    end

end