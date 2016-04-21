# individual messages within an inbox
class V1::CustomerInboxMessagesController < V1::ApplicationController

    before_action :validate_json_schema, only: [:create, :update]
    before_action :authenticate
    before_action :set_message_instance

    def show
        json = {
            data: V1::MessageInstanceSerializer.serialize(@message_instance)
        }

        render json: json
    end

    def update
        json = flatten_request({single_record: true})
        if @message_instance.update_attributes(message_params(json[:data]))
            json = {
                data: V1::MessageInstanceSerializer.serialize(@message_instance)
            }
            render json: json
        else
            render json: { errors: V1::MessageInstanceErrorSerializer.serialize(@message_instance.errors)}, status: :unprocessable_entity
        end
    end

    def destroy
        if @message_instance.destroy
            head :no_content
        else
            render json: {errors: V1::MessageInstanceErrorSerializer.serialize(@message_instance.errors)}, status: :internal_server_error
        end
    end

    private

    def set_message_instance
        @message_instance = MessageInstance.find(params[:id])
        if @message_instance.nil?
            head :not_found
        elsif @message_instance.customer_id != current_customer.id
            head :forbidden
        end
    end

    def message_params(local_params)
        local_params.fetch(:messages, {}).permit(:read)
    end
end
