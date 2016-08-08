module Experiences
    class Experience
        include Virtus.model
        include Elasticsearch::Model
        include ActiveModel::Validations
        include VirtusDirtyAttributes
        extend ActiveModel::Naming
        extend ActiveModel::Callbacks

        SHORT_URL_SEED = [*(0..9),*('a'..'z'),*('A'..'Z'),"-", ".", "_"]
        
        index_name 'experiences'
        document_type 'experience'

        define_model_callbacks :save, :create, :update, :destroy

        after_save on: [:create, :update] do
            __elasticsearch__.index_document
        end

        after_save on: [:destroy] do
            __elasticsearch__.delete_document
        end

        attribute :_id, BSON::ObjectId, default: lambda { |model, attribute| BSON::ObjectId.new }
        attribute :short_url, String, default: lambda { |model, attribute| SHORT_URL_SEED.sample(6).join }
        attribute :account_id, Integer
        attribute :title, String
        # current_version is used because the front-end doesn't know of versioned experiences
        # if in the future it is aware of versions this attribute isn't needed anymore
        # once an experience has been published it can no longer be edited
        attribute :current_version_id, BSON::ObjectId
        attribute :live_version_id, BSON::ObjectId
        attribute :current_version_updated_at, Time, default: lambda { |model, attribute| Time.zone.now }
        attribute :live_version_updated_at, Time, default: lambda { |model, attribute| Time.zone.now }

        attribute :published, Boolean, default: false
        attribute :archived, Boolean, default: false

        attribute :created_at, Time, default: lambda { |model, attribute| Time.zone.now }
        attribute :updated_at, Time, default: lambda { |model, attribute| Time.zone.now }

        settings index: ElasticsearchShardCountHelper.get_settings({ number_of_shards: 1, number_of_replicas: 1}).merge(
            {
                analysis:  {
                    filter: {
                        autocomplete_filter: {
                            type: "edge_ngram",
                            min_gram: 1,
                            max_gram: 15,
                            token_chars: ["letter", "digit"]
                        }
                    },
                    analyzer: {
                        autocomplete: {
                            type: "custom",
                            tokenizer: "standard",
                            filter: [
                                "lowercase",
                                "autocomplete_filter"
                            ]
                        }
                    }
                }
            }
        )

        mapping do
            indexes :account_id, type: 'integer', index: 'not_analyzed'
            indexes :title, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
            indexes :published, type: 'boolean', index: 'not_analyzed'
            indexes :archived, type: 'boolean', index: 'not_analyzed'
            indexes :updated_at, type: 'date'
            indexes :created_at, type: 'date'
        end

        validates :_id, presence: true
        validates :account_id, presence: true

        def id
            _id.to_s
        end

        def to_doc
            {
                _id: _id,
                title: title,
                short_url: short_url,
                account_id: account_id,
                published: published,
                archived: archived,
                current_version_id: current_version_id,
                live_version_id: live_version_id,
                current_version_updated_at: current_version_updated_at,
                live_version_updated_at: live_version_updated_at
            }
        end

        def as_indexed_json(opts = {})
            puts "Indexing document".green.bold
            {
                account_id: account_id,
                title: title,
                published: published,
                archived: archived,
                updated_at: updated_at,
                created_at: created_at
            }
        end

        def current_version
            return nil if current_version_id.nil?
            @current_version ||= Experiences::VersionedExperience.find(current_version_id)
        end

        def current_version=(version)
            return false if !version.is_a?(Experiences::VersionedExperience)
            self.current_version_id = version._id
            @current_version = version
            return self
        end


        def live_version
            return nil if live_version_id.nil?
            @live_version ||= Experiences::VersionedExperience.find(live_version_id)
        end

        def live_version=(version)
            return false if !version.is_a?(Experiences::VersionedExperience)
            self.live_version_id = version._id
            @live_version = version
            return self
        end

        def create
            run_callbacks :create do
                run_callbacks :save do
                    self.created_at = Time.zone.now
                    mongo[collection_name].insert_one(to_doc.merge("created_at" => self.created_at))
                    self.new_record = false
                    true
                end
            end

            changes_applied
            return self
        end

        def save
            # save
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

        def update_attribute(attribute, value)
            update_attributes(attribute => value)
        end

        def update_attributes(attributes)
            attributes.each { |k,v| self[k] = v }
            mongo[collection_name].find(_id: _id).update_one("$set" => attributes)
        end


        class << self

            def from_document(doc)
                return Experience.new(doc.merge(new_record: false))
            end

            def find(id)
                id = BSON::ObjectId(id) if id.is_a?(String)
                doc = mongo[collection_name].find(_id: id).first
                return nil if doc.nil?
                return Experience.from_document(doc)
            end

            def find_by(query)
                doc = mongo[collection_name].find(query).first
                return nil if doc.nil?
                return Experience.from_document(doc)
            end

            def find_all(ids)
                ids = ids.map { |id| id.is_a?(String) ? BSON::ObjectId(id) : id }
                docs = mongo[collection_name].find(_id: { "$in" => ids })
                docs = docs.map { |doc| Experience.from_document(doc) }
                return docs
            end

            def mongo
                $mongo
            end

            def collection_name
                'experiences'.freeze
            end
        end


        private

        def mongo
            $mongo
        end

        def collection_name
            'experiences'.freeze
        end
    end
end
