module Events
    module MessageEvents

        class SwipedEvent < MessageEvent

            def self.event_id
                Events::Constants::MESSAGE_SWIPED_EVENT_ID
            end

            Events::Pipeline.register("message", "swiped", self, { targetable: false })

            after_save :update_swiped_count_stats

            private

            def update_swiped_count_stats
                if !skip_message_stats && message_template_id
                    MessageTemplateStats.update_counters(message_template_id, total_swipes: 1)
                end
            end

        end
    end
end
