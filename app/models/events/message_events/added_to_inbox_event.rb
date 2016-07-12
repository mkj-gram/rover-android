module Events
    module MessageEvents

        class AddedToInboxEvent < MessageEvent

            def self.event_id
                Events::Constants::MESSAGE_ADDED_TO_INBOX_EVENT_ID
            end

            Events::Pipeline.register("message", "added-to-inbox", self, { targetable: false })


            after_save :update_delivered_stats

            attr_reader :skip_message_stats

            def initialize(event_attributes, extra)
                super event_attributes, extra
                @skip_message_stats = event_attributes.has_key?("skip_message_stats") ? event_attributes["skip_message_stats"] : false
            end


            private

            def update_delivered_stats
                if !skip_message_stats && message_template_id
                    MessageTemplateStats.update_counters(message_template_id, total_delivered: 1)
                end
            end

        end
    end
end
