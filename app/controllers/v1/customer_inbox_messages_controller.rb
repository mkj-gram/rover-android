# individual messages within an inbox
class V1::CustomerInboxMessagesController < V1::ApplicationController

    before_action :validate_json_schema, only: [:create, :update]
    before_action :authenticate
    before_action :set_message

    def show

        json = {
            data: V1::MessageSerializer.serialize(@message)
        }

        render json: json
    end

    def update
        json = flatten_request({single_record: true})
        if @message.update_attributes(message_params(json[:data]))
            current_customer.update_attributes(inbox_updated_at: Time.zone.now)
            json = {
                data: V1::MessageSerializer.serialize(@message)
            }
            render json: json
        else
            render json: { errors: V1::MessageErrorSerializer.serialize(@message.errors)}, status: :unprocessable_entity
        end
    end

    def destroy
        if @message.destroy
            current_customer.update_attributes(inbox_updated_at: Time.zone.now)
            head :no_content
        else
            render json: {errors: V1::MessageErrorSerializer.serialize(@message.errors)}, status: :internal_server_error
        end
    end

    private

    def set_message
        @message = Message.find(params[:id])
        if @message.nil?
            head :not_found
        elsif @message.customer_id != current_customer.id
            head :forbidden
        end
    end

    def message_params(local_params)
        local_params.fetch(:messages, {}).permit(:read)
    end
end
