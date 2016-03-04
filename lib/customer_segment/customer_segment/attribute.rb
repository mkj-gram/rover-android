module CustomerSegment
    module Attribute
        extend ActiveSupport::Concern

        class_methods do
            def segment_attribute(attribute_name)
                serialize attribute_name, CustomerSegment::Serializer
            end
        end
    end
end
