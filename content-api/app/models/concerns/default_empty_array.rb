module DefaultEmptyArray
    extend ActiveSupport::Concern

    class_methods do
        def default_empty_array_attribute(attribute_name)
            define_method("#{attribute_name}=") do |argument|
                if argument.nil?
                    self[attribute_name] = []
                else
                    self[attribute_name] = argument
                end
            end
        end
    end
end
