module Experiences
    class VersionedExperience
        include Virtus.model
        include VirtusDirtyAttributes
        extend ActiveModel::Naming
        extend ActiveModel::Callbacks

        define_model_callbacks :save, :create, :update, :destroy

        attribute :_id, BSON::ObjectId, default: lambda { |model, attribute| BSON::ObjectId.new }
        attribute :experience_id, BSON::ObjectId
        attribute :version_title, String
        attribute :home_screen_id, String
        attribute :custom_keys, Hash
        attribute :screens, Array[Hash]
        attribute :screen_data, Array[Hash]
        attribute :updated_at, Time, default: lambda { |model, attribute| Time.zone.now }
        attribute :created_at, Time

        def id
            _id.to_s
        end

        def to_doc
            {
                _id: _id,
                experience_id: experience_id,
                home_screen_id: home_screen_id,
                custom_keys: custom_keys,
                screens: screens, #screens.map(&:to_doc),
                version_title: version_title,
                updated_at: updated_at,
                created_at: created_at
            }
        end

        def merge!(other)
            self.screens = other.screens
            self.version_title = other.version_title
            self.home_screen_id = other.home_screen_id
            self.custom_keys = other.custom_keys
        end

        def check_sum
            # Digest::MD5.hexdigest(Oj.dump())
        end

        def load_screens!
            if @screens_loaded == false
                self.screens = screen_data
                @screens_loaded = true
            end
        end


        def create
            mongo[collection_name].insert_one(to_doc.merge("created_at" => Time.zone.now))
            return self
        end

        def save
            if new_record?
                create
            elsif changes.any?
                
                self.updated_at = Time.zone.now

                setters = changes.inject({}) do |hash, (k,v)|
                    new_value = v.last
                    new_value = new_value.to_doc if new_value.respond_to?(:to_doc)
                    hash.merge!({ k.to_s => new_value })
                    hash
                end

                run_callbacks :save do
                    mongo[collection_name].find("_id" => self._id).update_one("$set" => setters)
                    self.new_record = false
                    true
                end

                changes_applied
                return self
            else
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
                Experiences::VersionedExperience.new(doc.merge(new_record: false, from_db: true))
            end

            def mongo
                $mongo
            end

            def collection_name
                'versioned_experiences'
            end

            def find(id)
                return nil if BSON::ObjectId.legal?(id) == false
                id = BSON::ObjectId(id) if id.is_a?(String)
                doc = mongo[collection_name].find(_id: id).first
                return nil if doc.nil?
                return self.from_document(doc)
            end

            def find_all(ids)
                return [] if ids.empty?
                ids = ids.map { |id| id.is_a?(String) ? BSON::ObjectId(id) : id }
                docs = mongo[collection_name].find(_id: { "$in" => ids })
                docs = docs.map { |doc| VersionedExperience.from_document(doc) }
                return docs
            end

            def delete(id)
                id = BSON::ObjectId(id) if id.is_a?(String)
                return mongo[collection_name].find(_id: id).delete_one
            end

            def delete_all(query)
                $mongo[collection_name].find(query).delete_many
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
