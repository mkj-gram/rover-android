class V1::CustomerInboxController < V1::ApplicationController
    before_action :authenticate
    before_action :set_inbox

    def show
        if @inbox.nil?
            messages = []
        else
            messages = @inbox.messages.select{|message| message.saved_to_inbox == true}.reverse!
        end
        json = {
            data: messages.map{|message| V1::InboxMessageSerializer.serialize(message)}
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
