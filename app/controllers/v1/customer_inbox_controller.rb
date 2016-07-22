class V1::CustomerInboxController < V1::ApplicationController
    before_action :authenticate
    before_action :set_inbox

    def show

        if stale?(last_modified: current_customer.inbox_updated_at )
            Librato.timing('inbox.render.time') do
                messages = current_customer.inbox.messages.reverse!
                start_time  = Time.now
                json = {
                    data: messages.map{|message| V1::MessageSerializer.serialize(message)},
                    meta: {
                        "unread-messages-count" => messages.count { |message| message.read == false }
                    }
                }
                end_time = Time.now

                puts "TOOK: #{(end_time - start_time)} seconds"
                render json: Oj.dump(json)
            end
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

end
