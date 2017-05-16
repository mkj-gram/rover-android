require 'model_error/serializer/attribute'
module ModelError
    class Serializer
        module Attributes
            extend ActiveSupport::Concern

            included do
                self.class_attribute :_attributes_data
                self._attributes_data ||= {}
            end

            module ClassMethods
                def attribute(attr, options = {})
                    key = options.fetch(:error_key, attr)
                    model_error = options.fetch(:model_error, false)
                    relationship = options.fetch(:relationship, false)
                    _attributes_data[key] = Attribute.new(attr, model_error, relationship)
                end
            end
        end
    end
end
