class V1::ImagesController < V1::ApplicationController

    before_action :authenticate

    allow :all, ["admin", "server"]
    
    SUPPORTED_CONTENT_TYPES = ["image/png", "image/jpeg", "image/jpg"].freeze

    def create
        if params.has_key?(:image) && params[:image].is_a?(ActionDispatch::Http::UploadedFile)

            begin
                if SUPPORTED_CONTENT_TYPES.include?(params[:image].content_type)
                    compressed_file = Tinify.from_buffer(params[:image].read).to_buffer
                else
                    compressed_file = params[:image]
                end
            rescue Tinify::AccountError => e
                Raven.capture_exception(e)
                return head :internal_server_error
                # Verify your API key and account limit.
            rescue Tinify::ClientError => e
                Raven.capture_exception(e)
                return head :internal_server_error
                # Check your source image and request options.
            rescue Tinify::ServerError => e
                Raven.capture_exception(e)
                return head :internal_server_error
                # Temporary issue with the Tinify API.
            rescue Tinify::ConnectionError => e
                Raven.capture_exception(e)
                return head :internal_server_error
                # A network connection error occurred.
            rescue => e
                Raven.capture_exception(e)
                return head :internal_server_error
                # Something else went wrong, unrelated to the Tinify API.
            end
            

            resp = S3_IMAGE_BUCKET.put_object(
                {
                    acl: "public-read", # accepts private, public-read, public-read-write, authenticated-read, aws-exec-read, bucket-owner-read, bucket-owner-full-control
                    body: compressed_file, # file/IO object, or string data
                    key:  "uploads/#{Digest::MD5.hexdigest(current_account.id.to_s)}/#{SecureRandom.uuid}-#{params[:image].original_filename}", # required
                    content_type: params[:image].content_type,
                    cache_control: "31536000",
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
