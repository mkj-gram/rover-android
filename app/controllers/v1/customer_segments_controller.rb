class V1::CustomerSegmentsController < V1::ApplicationController
    before_action :authenticate
    before_action :set_customer_segment, only: [:show, :update, :destroy]

    def index
        # show all segments
        segments = Account.customer_segments
        json = {
            data: segments.map{|segment| V1::CustomerSegmentsSerializer.serialize(segment)}
        }
        render json: json
    end

    def show
        json = {
            data: V1::CustomerSegmentsSerializer.serialize(@customer_segment)
        }

        render json: json
    end

    def create

    end

    def update

    end

    def destroy

    end


    private

    def set_customer_segment
        @customer_segment = CustomerSegment.find_by_id(params[:id])
        head :not_found if @customer_segment.nil?
    end

    def customer_segment_params(local_params)

        convert_param_if_exists(local_params[:customer_segments], :name, :title)
        param_should_be_array(local_params[:customer_segments], :limits)

        local_params.fetch(:customer_segments, {}).permit(:title, :filters)
    end

end
