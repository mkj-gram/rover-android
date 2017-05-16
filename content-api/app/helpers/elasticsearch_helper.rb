module ElasticsearchHelper

	class << self
		def merge_queries(queryOne, queryTwo)
        	return queryOne.deep_merge(queryTwo) {|k, a, b| a.is_a?(Array) && b.is_a?(Array) ? a + b : b}
	    end
	end

end