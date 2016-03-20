module CustomerFilter
    module Filters
        class Filter
            attr_accessor :model, :attribute_name, :comparer, :filter_count


            def initialize(opts)
                @attribute_name = opts["attribute"]
                @path = opts["path"]
            end

            def model
                self.model_name
            end

            def dump
                {
                    "model" => self.model_name,
                    "attribute" => attribute_name,
                    "comparer" => comparer.dump
                }
            end

            def elasticsearch_query
                # builds an elasticsearch query using the comparer and field
                #
            end

            def formatted_attribute_name
                attribute_name.underscore
            end

            def get_value_for(model)
                if @path && model[attribute_name].is_a?(Hash)
                    model[attribute_name].dig(*@path.split("."))
                else
                    model[attribute_name]
                end
            end

            def valid?
                !(
                    attribute_name.nil? ||
                    comparer.nil?
                )
            end

        end
    end
end
