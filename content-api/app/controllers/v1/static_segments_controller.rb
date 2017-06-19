class V1::StaticSegmentsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema, only: [:create, :update]
    before_action :set_static_segment, only: [:show, :destroy]

    allow :admin, :server
    
    def index
        
        request = Rover::Segment::V1::ListStaticSegmentRequest.new(account_id: current_account.id, order_by: "created_at desc", page_size: 100)

        begin
            reply = segment_client.list_static_segments(request)
        rescue Exception => e
            if is_grpc_error(e)
                head grpc_error_code_to_http_code(e.code)
                return
            else
                raise e
            end
        end

        
        static_segments = reply.segments

        json = {
            data: static_segments.map{|static_segment| V1::StaticSegmentSerializer.serialize(static_segment)}
        }

        render json: json
    end

    def show
        json = {
            data: V1::StaticSegmentSerializer.serialize(@static_segment)
        }

        render json: json
    end

    def create
        json = flatten_request({single_record: true})
        
        attributes = static_segment_params(json[:data])

        request = Rover::Segment::V1::CreateStaticSegmentRequest.new(account_id: current_account.id, title: attributes[:title] || "")

        begin
            reply = segment_client.create_static_segment(request)
        rescue Exception => e
            if is_grpc_error(e)
                head grpc_error_code_to_http_code(e.code)
                return
            else
                raise e
            end
        end

        json = {
            data: V1::StaticSegmentSerializer.serialize(reply.segment)
        }

        render json: json
    end

    def destroy

        request = Rover::Segment::V1::DestroyStaticSegmentRequest.new(id: @static_segment.id)


        begin
            reply = segment_client.destroy_static_segment(request)
        rescue Exception => e
            if is_grpc_error(e)
                head grpc_error_code_to_http_code(e.code)
                return
            else
                raise e
            end
        end

        head :no_content
        
    end

    private

    def is_grpc_error(error)
        return error.respond_to?(:code) && error.respond_to?(:details)
    end

    def segment_client
        @segment_client ||= Rover::Segment::V1::DefaultClient.new
    end

    def set_static_segment
        request = Rover::Segment::V1::GetStaticSegmentRequest.new(id: params[:id].to_i, account_id: current_account.id)
        
        begin
            reply = segment_client.get_static_segment(request)
        rescue Exception => e
            if is_grpc_error(e)
                head grpc_error_code_to_http_code(e.code)
                return
            else
                raise e
            end
        end

        @static_segment = reply.segment
    end


    def static_segment_params(local_params)
        convert_param_if_exists(local_params[:static_segments], :name, :title)

        filtered_params = local_params.fetch(:static_segments, {}).permit(:title)

        return filtered_params
    end

end
