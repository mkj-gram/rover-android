module ModelError
    class Serializer
        class Attribute
            # defines the attribute to read from
            def initialize(attribute, model_error)
                @attribute = attribute
                @model_error = model_error
            end

            def serialize(key, errors)
                serialized_errors = []
                local_errors = errors[@attribute]
                local_errors.each do |error|
                    if @model_error
                        serialized_errors.push({
                                                 detail: error,
                                                 source: {
                                                     pointer: "data"
                                                 }
                        })
                    else
                        serialized_errors.push({
                                                 detail: error,
                                                 source: {
                                                     pointer: "data/attributes/#{key}"
                                                 }
                        })
                    end
                end
                return serialized_errors
            end
        end
    end
end
