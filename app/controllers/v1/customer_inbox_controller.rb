class V1::CustomerInboxController < V1::ApplicationController
    before_action :authenticate

    def show
        inbox = current_customer.inbox
        messages = inbox.messages.reverse!
        json = {
            data: messages.map{|message| V1::InboxMessageSerializer.serialize(message)}
        }

        render json: json
    end


    private

end
