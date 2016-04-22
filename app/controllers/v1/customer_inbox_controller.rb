class V1::CustomerInboxController < V1::ApplicationController
    before_action :authenticate
    before_action :set_inbox

    def show

        messages = current_customer.inbox.messages

        json = {
            data: messages.map{|message| V1::MessageSerializer.serialize(message)}
        }

        render json: json

    end


    private

    def set_inbox
        if current_customer
            @inbox = current_customer.inbox
        else
            head :not_found
        end
    end

end
