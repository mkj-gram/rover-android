module ConfigurationVisit
    extend ActiveSupport::Concern

    included do
        include ActiveModel::Model
        include Elasticsearch::Model
        include Virtus.model

        index_name "customers"

        attribute :customer, Customer
        attribute :last_visit_at, DateTime

        settings do
            mapping _parent: { type: 'customer' } do
                indexes :configuration_id, type: 'integer', index: 'not_analyzed'
                indexes :configuration_tags, type: 'string', index: 'not_analyzed'
                indexes :last_visit_at, type: 'date', index: 'not_analyzed'
            end
        end

        validates :last_visit_at, presence: true
        validates :customer, presence: true
        validates :id, presence: true

    end

    def as_indexed_json(opts ={})
        {
            configuration_id: configuration_id,
            configuration_tags: configuration_tags,
            last_visit_at: last_visit_at
        }
    end


end
