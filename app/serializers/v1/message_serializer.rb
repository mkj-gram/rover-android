module V1::MessageSerializer
    class << self
        def serialize(message)
            {
                type: "messages",
                id: message.id.to_s,
                attributes: {
                    :"notification-text" => message.notification_text,
                    :"ios-title" => message.ios_title,
                    :"android-title" => message.android_title,
                    :"tags" => message.tags,
                    :"read" => message.read,
                    :"saved-to-inbox" => message.saved_to_inbox,
                    :"content-type" => message.content_type,
                    :"website-url" => message.website_url,
                    :"timestamp" => message.timestamp.iso8601(3),
                    :"landing-page" => message.landing_page.nil? ? nil : message.landing_page.as_json(dasherize: true),
                    :"extras" => message.extras
                }
            }
        end
    end
end
