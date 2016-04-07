class GimbalPlace < ActiveRecord::Base
    include Elasticsearch::Model
    self.primary_key = :id

    after_commit on: [:create, :update] do
        __elasticsearch__.index_document
    end

    after_commit on: [:destroy] do
        __elasticsearch__.delete_document
    end

    settings index: ElasticsearchShardCountHelper.get_settings({ number_of_shards: 2, number_of_replicas: 1}).merge(
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

    belongs_to :account, counter_cache: :searchable_gimbal_places_count

    def as_indexed_json(opts = {})
        {
            account_id: self.account_id,
            name: self.name,
            created_at: self.created_at
        }
    end

end
