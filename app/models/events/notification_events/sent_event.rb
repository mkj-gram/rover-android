module Events
    module NotificationEvents

        class SentEvent < NotificationEvent

        	def self.event_id
                Events::Constants::NOTIFICATION_SENT_EVENT_ID
            end

            Events::Pipeline.register("notification", "sent", self, { targetable: false })
            
        end

    end
end
