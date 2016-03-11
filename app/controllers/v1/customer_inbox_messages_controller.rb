# individual messages within an inbox
class V1::CustomerInboxMessagesController < V1::ApplicationController
    before_action :validate_json_schema, only: [:create, :update]
    before_action :authenticate
    before_action :set_inbox
    before_action :set_message

    def show
        json = {
            "data" => V1::InboxMessageSerializer.serialize(@message)
        }

        render json: json
    end

    def update
        json = flatten_request({single_record: true})
        if @message.update_attributes(message_params(json[:data]))
            json = {
                "data" => V1::InboxMessageSerializer.serialize(@message)
            }
            render json: json
        else
            render json: { errors: V1::InboxMessageErrorSerializer.serialize(@message.errors)}, status: :unprocessable_entity
        end
    end

    def destroy
        if @message.destroy
            head :no_content
        else
            render json: {errors: V1::InboxMessageErrorSerializer.serialize(@message.errors)}, status: :internal_server_error
        end
    end

    private

    def set_inbox
        if current_customer
            @inbox = current_customer.inbox
        else
            head :not_found
        end
    end

    def set_message
        if @inbox
            @message = @inbox.messages.where("_id" => params[:id]).first
            if @message.nil?
                head :not_found
            end
        else
            head :not_found
        end
    end

    def message_params(local_params)
        local_params.fetch(:messages, {}).permit(:read)
    end
end
