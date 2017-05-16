class ExperienceStats
    include Virtus.model(:nullify_blank => true)

    attribute :_id, BSON::ObjectId
    attribute :total_opens, Integer, default: 0
    
    alias_method :experience_id, :_id

    def id
        _id.to_s
    end

    class << self

        def mongo_client
            $mongo
        end

        def collection_name
            "experience_stats"
        end

        def from_document(doc)
            ExperienceStats.new(doc)
        end

        def find(id)
            id = BSON::ObjectId(id) if id.is_a?(String)
            doc = mongo_client[collection_name].find("_id" => id).limit(1).first
            return nil if doc.nil?
            return ExperienceStats.from_document(doc)
        end

        def find_all(ids)
            return [] if ids.nil? || ids.empty?
            ids = ids.map{|id| id.is_a?(String) ? BSON::ObjectId(id) : id }
            docs = mongo_client[collection_name].find("_id" => {"$in" => ids }).map{|document| ExperienceStats.from_document(document) }
            return docs
        end

        def update_counters(id, counters)
            id = BSON::ObjectId(id) if id.is_a?(String)
            command = counters.inject({}) { |hash, (k,v)| hash.merge!( k.to_s => v ) }
            mongo_client[collection_name].find("_id" => id).update_one({"$inc" => command}, { upsert: true })
        end
    end

    def to_doc
        {
            _id: _id,
            total_opens: total_opens
        }
    end

    def create
        mongo_client[collection_name].insert_one(self.to_doc)
    end

    def mongo_client
        ExperienceStats.mongo_client
    end

    def collection_name
        ExperienceStats.collection_name
    end

    def experience_id=(id)
        id = BSON::ObjectId(id) if id.is_a?(String)
        self[:_id] = id
    end
end
