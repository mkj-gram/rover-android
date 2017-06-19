class V1::CustomerSegmentCalculateController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema, only: [:create]
    before_action :check_access, only: [:create]

    allow :all, ["admin", "server"]

    def create
        json = flatten_request({single_record: true})
        customer_segment = CustomerSegment.new(customer_segment_params(json[:data]))
        customer_segment.account = current_account
        customer_segment.account_id = current_account.id
        if customer_segment.valid?
            customer_segment.calculate_customers_count
            json = {
                :"approximate-customers-count" => customer_segment.approximate_customers_count,
                :"total-customers-count" => current_account.customers_count
            }
            render json: json
        else
            render json: { errors: V1::CustomerSegmentErrorSerializer.serialize(customer_segment.errors)}, status: :unprocessable_entity
        end
    end

    def resource
        CustomerSegment
    end

    private

    def customer_segment_params(local_params)

        convert_param_if_exists(local_params[:segments], :name, :title)
        param_should_be_array(local_params[:segments], :filters)

        filtered_params = local_params.fetch(:segments, {}).permit(:title)
        if local_params.dig(:segments, :filters)
            filtered_params[:filters] = local_params[:segments][:filters]
        end
        return filtered_params
    end

end
