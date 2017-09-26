module Events
    module NotificationEvents

        class SentEvent < NotificationEvent

            Events::Pipeline.register("notification", "sent", self, { targetable: false })

            def self.event_id
                Events::Constants::NOTIFICATION_SENT_EVENT_ID
            end

            after_save :update_stats

            def update_stats
                if message
                    counters = { total_notifications_sent: 1, notifications_attempted: 1,  notifications_delivered: 1 }
                    MessageTemplateStats.update_counters(message.message_template_id, counters)
                end
            end
            
        end
    end
end
