module Events
    module MessageEvents

        class DeliveredEvent < MessageEvent

            def self.event_id
                Events::Constants::MESSAGE_DELIVERED_EVENT_ID
            end

            Events::Pipeline.register("message", "delivered", self, { targetable: false })


            after_save :update_delivered_stats

            attr_reader :skip_message_stats

            def initialize(event_attributes)
                super
                @skip_message_stats = event_attributes.has_key?("skip_message_stats") ? event_attributes["skip_message_stats"] : false
            end


            private

            def update_delivered_stats
                if !skip_message_stats && message_template_id
                    MessageTemplateStats.update_counters(message_template_id, delivered_count: 1)
                end
            end

        end
    end
end
