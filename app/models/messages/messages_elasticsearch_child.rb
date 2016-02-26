module MessagesElasticsearchChild
    extend ActiveSupport::Concern

    included do
        index_name Message.index_name

        mapping do
            indexes :account_id, type: 'long', index: 'not_analyzed'
            indexes :title, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
            indexes :tags, type: 'string', index: 'not_analyzed'
            indexes :notification_text, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
            indexes :published, type: 'boolean', index: 'not_analyzed'
            indexes :archived, type: 'boolean', index: 'not_analyzed'
            indexes :approximate_customers_count, type: 'integer', index: 'no'
            indexes :action, type: 'string', index: 'no'
            indexes :created_at, type: 'date', index: 'not_analyzed', store: 'no'
        end
    end

    class_methods do
        def create_index!(opts = {})
            client = self.__elasticsearch__.client
            if !client.indices.exists?(index: Message.index_name)
                client.indices.create(index: Message.index_name, body: Message.settings.to_hash)
            end
            if client.indices.get_mapping(index: Message.index_name, type: self.document_type).empty?
                client.indices.put_mapping(index: Message.index_name, type: self.document_type, body: self.mappings.to_hash)
            else
                Rails.logger.warn("Index with mapping already exists")
            end
        end
    end
end
