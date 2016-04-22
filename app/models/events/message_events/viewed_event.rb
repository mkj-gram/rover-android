module Events
    module MessageEvents

        class ViewedEvent < MessageEvent

            def self.event_id
                Events::Constants::MESSAGE_VIEWED_EVENT_ID
            end

            Events::Pipeline.register("message", "viewed", self, { targetable: false })

            after_save :update_message_viewed_stats



            private

            def update_message_viewed_stats
                if !skip_message_stats && message_template_id
                    if message.viewed
                        MessageTemplateStats.update_counters(message_template_id, total_views: 1)
                    else
                        message.update_attribute({viewed: true})
                        MessageTemplateStats.update_counters(message_template_id, total_views: 1, unique_views: 1)
                    end
                end
            end

        end

    end
end
