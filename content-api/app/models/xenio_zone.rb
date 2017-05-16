class XenioZone < ActiveRecord::Base
    include Elasticsearch::Model
    
    index_name "xenio"
    document_type "zone"

    validates :account_id, presence: true
    validates :xenio_integration_id, presence: true
    
    self.primary_key = :id

    after_commit on: [:create, :update] do
        __elasticsearch__.index_document
    end

    after_commit on: [:destroy] do
        begin
            __elasticsearch__.delete_document 
        rescue Elasticsearch::Transport::Transport::Errors::NotFound
        end
    end

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
        indexes :name, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
        indexes :created_at, type: 'date'
    end

    belongs_to :account, counter_cache: :searchable_xenio_zones_count
    
    before_create :add_default_name_tag

    before_save :ensure_non_null_tags
    after_save :update_active_tags

    def as_indexed_json(opts = {})
        {
            account_id: self.account_id,
            name: self.name,
            created_at: self.created_at
        }
    end

    private

    def add_default_name_tag
        if self.name
            self.tags = (( self.tags || []) + [ self.name ]).uniq
        end
    end

    def ensure_non_null_tags
        self.tags = [] if self.tags.nil?
    end

    def update_active_tags
        if self.changes.include?(:tags)
            previous_tags = (tags_was || [])
            uniq_tags = (tags || []).uniq
            old_tags = previous_tags - uniq_tags
            new_tags = uniq_tags - previous_tags
            XenioZoneActiveTag.update_tags(self.account_id, old_tags, new_tags)
        end
    end

end
