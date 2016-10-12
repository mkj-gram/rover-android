module FcmHelper

    class << self

        INVALID_REGISTRATION = "InvalidRegistration".freeze
        NOT_REGISTERED = "NotRegistered".freeze

        def send(android_platform, messages_by_token)
            return if messages_by_token.empty?

            client = FCM.new(android_platform.api_key)
            expired_tokens = []

            notifications = messages_to_notifications(messages_by_token)

            expired_tokens = send_with_connection(client, notifications)

            return expired_tokens
        end

        def messages_to_notifications(messages_by_token)
            notifications = []
            messages_by_token.each do |token, messages|
                messages.each do |message|
                    payload = payload_from_message(message)
                    data = {
                        token: token,
                        data: { message: payload, _rover: true },

                    }
                    notifications.push(data)
                end
            end
            return notifications
        end

        def send_with_connection(connection, notifications)
            expired_tokens = []
            notifications.each do |notification|
                response = connection.send_with_notification_key(notification[:token], { notification: notification[:notification], data: notification[:data]})
                
                if response[:status] == 401
                    return []
                end

                body = JSON.parse(response[:body])
                if body.has_key?("failure") && body["failure"] > 0
                    body["results"].each do |result|
                        if result.has_key?("error")
                            Rails.logger.warn("Error while sending notification to android device #{result["error"]}")
                        end

                        if result.has_key?("error") && (result["error"] == INVALID_REGISTRATION || result["error"] == NOT_REGISTERED)
                            expired_tokens.push(notification[:token])
                        end
                    end
                end
            end
            return expired_tokens
        end

        private

        # def get_click_action_for_message(message)
        #     format("%s.%s.%s", "io.rover", "messages",  message.content_type.underscore.upcase)
        # end

        def payload_from_message(inbox_message)
            json = V1::MessageSerializer.serialize(inbox_message)
            json[:attributes].delete(:"landing-page")
            json
            # { "message-id" => inbox_message.id.to_s }
        end

    end

end
