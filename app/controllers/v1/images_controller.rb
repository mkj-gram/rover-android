class V1::ImagesController < V1::ApplicationController

    before_action :authenticate

    def create
        if params.has_key?(:image) && params[:image].is_a?(ActionDispatch::Http::UploadedFile)
            resp = S3_IMAGE_BUCKET.put_object(
                {
                    acl: "public-read", # accepts private, public-read, public-read-write, authenticated-read, aws-exec-read, bucket-owner-read, bucket-owner-full-control
                    body: params[:image], # file/IO object, or string data
                    key:  "uploads/#{Digest::MD5.hexdigest(current_account.id.to_s)}/#{SecureRandom.uuid}-#{params[:image].original_filename}", # required
                    metadata: {
                        "ContentType" => params[:image].content_type,
                    },
                    server_side_encryption: "AES256", # accepts AES256, aws:kms
                    storage_class: "STANDARD", # accepts STANDARD, REDUCED_REDUNDANCY, STANDARD_IA
                    use_accelerate_endpoint: false,
                }
            )
            s3url = URI(resp.public_url)
            url = URI("https://images-rover-io.imgix.net")
            url.path = s3url.path.gsub(/images.rover.io\//, '')
            render json: { "image-url" => url.to_s }
        else
            head :bad_request
        end
    end

end
