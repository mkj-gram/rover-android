module CustomerFilter
    module Attribute
        extend ActiveSupport::Concern

        class_methods do
            def segment_attribute(attribute_name)
                serialize attribute_name, CustomerFilter::Serializer
            end
        end
    end
end
