module ModelError
    class Serializer
        class Attribute
            # defines the attribute to read from
            def initialize(attribute)
                @attribute = attribute
            end

            def serialize(key, errors)
                serialized_errors = []
                local_errors = errors[@attribute]
                local_errors.each do |error|
                    serialized_errors.push({
                                             detail: error,
                                             source: {
                                                 pointer: "data/attributes/#{key}"
                                             }
                    })
                end
                return serialized_errors
            end
        end
    end
end
