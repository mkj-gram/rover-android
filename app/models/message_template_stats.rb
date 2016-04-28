class MessageTemplateStats
    include Virtus.model(:nullify_blank => true)

    attribute :_id, Integer
    attribute :total_delivered, Integer, default: 0
    attribute :total_views, Integer, default: 0
    attribute :total_swipes, Integer, default: 0
    attribute :unique_views, Integer, default: 0

    alias_method :message_template_id, :_id

    def self.mongo_client
        $mongo
    end

    def mongo_client
        MessageTemplateStats.mongo_client
    end

    def self.collection_name
        "message_template_stats"
    end

    def collection_name
        MessageTemplateStats.collection_name
    end

    def self.from_document(doc)
        MessageTemplateStats.new(doc)
    end

    def self.find(id)
        doc = mongo_client[collection_name].find("_id" => id).limit(1).first
        return nil if doc.nil?
        return MessageTemplateStats.from_document(doc)
    end

    def self.update_counters(id, counters)
        command = counters.inject({}) { |hash, (k,v)| hash.merge!( k.to_s => v ) }
        mongo_client[collection_name].find("_id" => id).update_one({"$inc" => command}, { upsert: true })
    end

    def message_template_id=(template_id)
        self[:_id] = template_id
    end
end
