class V1::CustomerInboxController < V1::ApplicationController
    before_action :authenticate
    before_action :set_inbox

    def show
        last_modified = current_customer.inbox_updated_at ? current_customer.inbox_updated_at.utc : Time.zone.now
        Rails.logger.debug("If-Modified-Since #{request.headers['If-Modified-Since']}".green.bold)
        Rails.logger.debug("Last-Modified: #{last_modified}".green.bold)

        if stale?(last_modified: last_modified)
            Librato.timing('inbox.render.time') do
                messages = current_customer.inbox.messages.reverse!

                json = {
                    data: messages.map{|message| V1::MessageSerializer.serialize(message)},
                    meta: {
                        "unread-messages-count" => messages.count { |message| message.read == false }
                    }
                }

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
