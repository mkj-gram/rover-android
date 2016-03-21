module CustomerFilter
    module Filters
        class Filter
            attr_accessor :model, :attribute_name, :comparer, :filter_count


            def initialize(opts)
                @attribute_name = opts["attribute"]
                @path = opts["path"]
                @id = opts["id"] || SecureRandom.uuid
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

            # Given a model it performs an attribute lookup using the formatted attribute name
            # eg. model = Filters::Device
            # attribute_name = "os-name" formatted_attribute_name = "os_name"
            # lookup model[formatted_attribute_name] -> "iOS"
            def get_value_for(model)
                if @path && model[formatted_attribute_name].is_a?(Hash)
                    model[formatted_attribute_name].dig(*@path.split("."))
                else
                    model[formatted_attribute_name]
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
