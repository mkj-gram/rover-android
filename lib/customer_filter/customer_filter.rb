require 'customer_filter/comparers'
require 'customer_filter/filters'
require 'customer_filter/attribute_type'
module CustomerFilter

    class << self

        def compute_filter_count(account, filters)
            return account.customers_count if filters.nil? || filters.empty?

            # merge all filters comparer queries
            query = {}

            filters.each do |filter|
                query.deep_merge!(filter.elasticsearch_query) {|k, a, b| a.is_a?(Array) && b.is_a?(Array) ? a + b : b}
            end

            return Elasticsearch::Model.client.count(index: ::Customer.get_index_name(account), body: query)["count"]
        end

    end

    # we can have types
    # types
    # :string
    # :boolean
    # :array
    # :string
    # :date
    #
    # certain types can only have a certain comparer
    #
    # string comparer
    # boolean comparer
    #
    # comparer
    # is
    # is not
    # starts_with
    # ends_with
    # contains
    # does not contain
    #
    #
end
