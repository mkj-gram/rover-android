module MessageLimit
    module Attribute
        extend ActiveSupport::Concern

        class_methods do
            def message_limit_attribute(attribute_name)
                serialize attribute_name, MessageLimit::Serializer
            end
        end
    end
end
