module Experiences
    class VersionedExperience

        attr_reader :_id
        attr_accessor :experience_id, :has_unpublished_changes, :published, :archived, :screens, :new_record

        def initialize(atr = {})
            id = atr.delete(:_id)
            id = BSON::ObjectId.new() if id.nil?
            id = BSON::ObjectId(id) if id.is_a?(String)

            @_id = id
            @experience_id = atr[:experience_id].nil? ? nil : BSON::ObjectId(atr.delete(:experience_id))
            @version_title = atr.delete(:version_title)
            @screens = atr.delete(:screens) || []
            @updated_at = atr.delete(:updated_at) || Time.zone.now
            @created_at = atr.delete(:created_at) || Time.zone.now
            @new_record = atr.delete(:new_record)
            @new_record = true if @new_record.nil?
        end

        def id
            _id.to_s
        end

        def to_doc
            {
                _id: @_id,
                screens: @screens
            }
        end

        def check_sum
            # Digest::MD5.hexdigest(Oj.dump())
        end

        def new_record?
            @new_record
        end


        def create
            mongo[collection_name].insert_one(to_doc.merge("created_at" => Time.zone.now))
            return self
        end

        def save
            if new_record?
                create
            else
                doc = to_doc
                doc.delete(:_id)
                setters = doc.merge("updated_at" => Time.zone.now)
                mongo[collection_name].find(_id: @_id).update_one("$set" => setters)
                return self
            end
        end

        def update_attributes(attributes)
            mongo[collection_name].find(_id: @_id).update_one("$set" => attributes)
            return self
        end

        def merge_experience!(experience)
            puts "merging with this thing #{experience}".green.bold
            return true
        end

        class << self
            def from_document(doc)
                Experiences::VersionedExperience.new(doc.merge(new_record: false))
            end

            def mongo
                $mongo
            end

            def collection_name
                'versioned_experiences'
            end

            def find(id)
                id = BSON::ObjectId(id) if id.is_a?(String)
                doc = mongo[collection_name].find(_id: id).first
                return nil if doc.nil?
                return self.from_document(doc)
            end
        end

        private


        def mongo
            $mongo
        end

        def collection_name
            'versioned_experiences'
        end

    end
end
