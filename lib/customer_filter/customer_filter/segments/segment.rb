module CustomerFilter
    module Filters
        class Filter
            attr_accessor :attribute_name, :comparer, :filter_count


            def initialize(opts)
                @attribute_name = opts["attribute"]
                @path = opts["path"]
                @filter_count = opts["filter_count"]
            end

            def dump
                {
                    "model" => self.model_name,
                    "attribute" => attribute_name,
                    "filter_count" => filter_count,
                    "comparer" => comparer.dump
                }
            end

            def elasticsearch_query
                # builds an elasticsearch query using the comparer and field
                #
            end

            def get_value_for(model)
                if @path && model[attribute_name].is_a?(Hash)
                    model[attribute_name].dig(*@path.split("."))
                else
                    model[attribute_name]
                end
            end

        end
    end
end
