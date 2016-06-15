class V1::IosPlatformCertificateController < V1::ApplicationController
    before_action :authenticate
    before_action :set_ios_platform, only: [:update]


    def update
        if params.has_key?(:certificate) && params[:certificate].is_a?(ActionDispatch::Http::UploadedFile) && params[:certificate].content_type != "application/x-pkcs12"
            render json: { errors: [ { title: "Invalid format", detail: "the certificate must be a p12 encoded certificate" }]}, status: :unprocessable_entity
        else
            if @ios_platform.update_attributes(ios_platform_certificate_params(params))
                json = {
                    data: V1::IosPlatformSerializer.serialize(@ios_platform)
                }
                render json: json
            else
                render json: { errors: V1::IosPlatformErrorSerializer.serialize(@ios_platform.errors)}, status: :unprocessable_entity
            end
        end
    end


    private

    def set_ios_platform
        @ios_platform = current_account.ios_platform
        head :not_found if @ios_platform.nil?
        head :not_found if @ios_platform.id.to_s != params[:ios_platform_id].to_s
    end

    def ios_platform_certificate_params(local_params)
        (local_params || {}).permit(:certificate, :passphrase)
    end

end
