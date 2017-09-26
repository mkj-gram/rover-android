class MessageTemplateStats
    include Virtus.model(:nullify_blank => true)

    attribute :_id, Integer
    attribute :total_delivered, Integer, default: 0
    attribute :total_notification_opens, Integer, default: 0
    attribute :total_inbox_opens, Integer, default: 0
    attribute :total_opens, Integer, default: 0
    attribute :unique_opens, Integer, default: 0
    attribute :total_notifications_sent, Integer, default: 0
    attribute :total_notifications_failed, Integer, default: 0
    attribute :total_audience_size, Integer, default: 0

    attribute :notifications_attempted, Integer, default: 0
    attribute :notifications_delivered, Integer, default: 0
    attribute :notifications_unreachable, Integer, default: 0
    attribute :notifications_invalid, Integer, default: 0

    alias_method :message_template_id, :_id

    def id
        _id
    end

    class << self

        def mongo_client
            $mongo
        end

        def collection_name
            "message_template_stats"
        end

        def from_document(doc)
            if doc["notifications_delivered"].nil?
                doc["notifications_delivered"] = doc["total_notifications_sent"].to_i
            end

            if doc["notifications_invalid"].nil?
                doc["notifications_invalid"] = doc["total_notifications_failed"].to_i
            end

            if doc["notifications_attempted"].nil?
                doc["notifications_attempted"] = doc["total_notifications_sent"].to_i + doc["total_notifications_failed"].to_i
            end

            MessageTemplateStats.new(doc)
        end

        def find(id)
            doc = mongo_client[collection_name].find("_id" => id).limit(1).first
            return nil if doc.nil?
            return MessageTemplateStats.from_document(doc)
        end

        def find_all(ids)
            return [] if ids.nil? || ids.empty?
            docs = mongo_client[collection_name].find("_id" => {"$in" => ids }).map{|document| MessageTemplateStats.from_document(document) }
            return docs
        end

        def update_counters(id, counters)
            command = counters.inject({}) { |hash, (k,v)| hash.merge!( k.to_s => v ) }
            mongo_client[collection_name].find("_id" => id).update_one({"$inc" => command}, { upsert: true })
        end
    end

    def to_doc
        {
            _id: _id,
            total_delivered: total_delivered,
            total_notification_opens: total_notification_opens,
            total_inbox_opens: total_inbox_opens,
            total_opens: total_opens,
            unique_opens: unique_opens,
            notifications_attempted: notifications_attempted,
            notifications_delivered: notifications_delivered,
            notifications_invalid: notifications_invalid,
            notifications_unreachable: notifications_unreachable
        }
    end

    def create
        mongo_client[collection_name].insert_one(self.to_doc)
    end

    def mongo_client
        MessageTemplateStats.mongo_client
    end

    def collection_name
        MessageTemplateStats.collection_name
    end

    def message_template_id=(template_id)
        self[:_id] = template_id
    end
end
