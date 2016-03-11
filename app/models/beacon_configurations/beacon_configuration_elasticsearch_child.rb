module BeaconConfigurationElasticsearchChild
    extend ActiveSupport::Concern

    included do
        index_name BeaconConfiguration.index_name

        mapping do
            indexes :account_id, type: 'long', index: 'not_analyzed'
            indexes :title, type: 'string', index_analyzer: "autocomplete", search_analyzer: "simple"
            indexes :tags, type: 'string', index: 'not_analyzed'
            indexes :shared_account_ids, type: 'long', index: 'not_analyzed'
            indexes :location, type: 'object' do
                indexes :name, type: 'string', index: 'no'
                indexes :id, type: 'integer', index: 'not_analyzed'
            end

            indexes :created_at, type: 'date'
            indexes :devices_meta, type: 'object' do
                indexes :type, type: 'string', index: "no"
                indexes :count, type: 'integer', index: "no"
            end
        end
    end


end
