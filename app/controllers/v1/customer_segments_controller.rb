class V1::CustomerSegmentsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema, only: [:create, :update]
    before_action :set_customer_segment, only: [:show, :update, :destroy]

    def index
        # show all segments
        segments = Account.customer_segments
        json = {
            data: segments.map{|segment| V1::CustomerSegmentSerializer.serialize(segment, {:"total-customers-count" => current_account.customers_count})}
        }
        render json: json
    end

    def show
        json = {
            data: V1::CustomerSegmentSerializer.serialize(@customer_segment, {:"total-customers-count" => current_account.customers_count})
        }

        render json: json
    end

    def create
        json = flatten_request({single_record: true})
        customer_segment = CustomerSegment.new(customer_segment_params(json[:data]))
        customer_segment.account = current_account
        customer_segment.account_id = current_account.id
        if customer_segment.save
            json = {
                data: V1::CustomerSegmentSerializer.serialize(customer_segment, {:"total-customers-count" => current_account.customers_count})
            }
            render json: json
        else
            render json: { errors: V1::CustomerSegmentErrorSerializer.serialize(@customer_segment.errors)}, status: :unprocessable_entity
        end
    end

    def update
        json = flatten_request({single_record: true})
        if @customer_segment.update_attributes(customer_segment_params(json[:data]))
            json = {
                data: V1::CustomerSegmentSerializer.serialize(@customer_segment, {:"total-customers-count" => current_account.customers_count})
            }
            render json: json
        else
            render json: { errors: V1::CustomerSegmentErrorSerializer.serialize(@customer_segment.errors)}, status: :unprocessable_entity
        end
    end

    def destroy
        if @customer_segment.destroy
            head :no_content
        else
            render json: { errors: V1::CustomerSegmentErrorSerializer.serialize(@customer_segment.errors)}, status: :unprocessable_entity
        end
    end


    private

    def set_customer_segment
        @customer_segment = CustomerSegment.find_by_id(params[:id])
        head :not_found if @customer_segment.nil?
    end

    def customer_segment_params(local_params)

        convert_param_if_exists(local_params[:segments], :name, :title)
        param_should_be_array(local_params[:segments], :filters)

        local_params.fetch(:segments, {}).permit(:title, :filters => [])
    end

end
