module Events
    module NotificationEvents

        class FailedEvent < NotificationEvent

        	def self.event_id
                Events::Constants::NOTIFICATION_FAILED_EVENT_ID
            end

            Events::Pipeline.register("notification", "failed", self, { targetable: false })
            
        end

    end
end
