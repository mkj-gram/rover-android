class V1::CustomerInboxController < V1::ApplicationController
    before_action :authenticate
    before_action :set_inbox

    def show

        # if stale?(last_modified: current_customer.inbox_updated_at )
            messages = current_customer.inbox.messages.reverse!

            json = {
                data: messages.map{|message| V1::MessageSerializer.serialize(message)},
                meta: {
                    "unread-messages-count" => messages.count { |message| message.read == false }
                }
            }

            render json: json
        # end

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
