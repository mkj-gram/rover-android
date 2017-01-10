module Events
    module NotificationEvents

        class FailedEvent < NotificationEvent

            Events::Pipeline.register("notification", "failed", self, { targetable: false })

            def self.event_id
                Events::Constants::NOTIFICATION_FAILED_EVENT_ID
            end

            after_save :update_stats

            def update_stats
                if message
                    counters = { total_notifications_failed: 1 }
                    MessageTemplateStats.update_counters(message.message_template_id, counters)
                end
            end

        end
    end
end
