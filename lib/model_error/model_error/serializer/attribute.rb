module ModelError
    class Serializer
        class Attribute
            # defines the attribute to read from
            def initialize(attribute, model_error, relationship = false)
                @attribute = attribute
                @model_error = model_error
                @relationship = relationship
            end

            def serialize(key, errors)
                serialized_errors = []
                local_errors = errors[@attribute]
                # key is the local key
                local_errors.each do |error|
                    if @model_error
                        serialized_errors.push(serialize_model_error(error))
                    elsif @relationship
                        serialized_errors.push(serialize_relationship_error(key, error))
                    else
                        serialized_errors.push(serialize_attribute_error(key, error))
                    end
                end
                return serialized_errors
            end

            private

            def serialize_model_error(error)
                {
                    data: error,
                    source: {
                        pointer: "data"
                    }
                }
            end

            def serialize_attribute_error(key, error)
                {
                    detail: error,
                    source: {
                        pointer: "data/attributes/#{key}"
                    }
                }
            end

            def serialize_relationship_error(key, error)
                {
                    detail: error,
                    source: {
                        pointer: "data/relationships/#{key}"
                    }
                }
            end
        end
    end
end
