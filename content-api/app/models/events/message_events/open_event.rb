module Events
    module MessageEvents

        class OpenedEvent < MessageEvent

            def self.event_id
                Events::Constants::MESSAGE_OPENED_EVENT_ID
            end

            Events::Pipeline.register("message", "open", self, { targetable: false })

            NOTIFICATION_SOURCE = "notification".freeze
            INBOX_SOURCE = "inbox".freeze

            after_save :update_message_viewed_stats

            attr_reader :source

            def initialize(event_attributes, extra)
                super event_attributes, extra
                @source = event_attributes["source"]
            end

            def attributes
                parent_attributes = super
                parent_attributes[:event][:source] = source if source
                return parent_attributes
            end

            private

            def update_message_viewed_stats
                if message

                    counters = { total_opens: 1 }

                    if !message.viewed
                        message.update_attribute(viewed: true)
                        counters.merge!(unique_opens: 1)
                    end

                    if source == NOTIFICATION_SOURCE
                        counters.merge!(total_notification_opens: 1)
                    end

                    if source == INBOX_SOURCE
                        counters.merge!(total_inbox_opens: 1)
                    end

                    MessageTemplateStats.update_counters(message.message_template_id, counters)

                end
            end
        end
    end
end
