module MessageLimit
    module Serializer
        class << self
            def load(value)
                if value.is_a?(Array)
                    value.map{|v| deserialize(v)}.compact
                elsif value.is_a?(Hash)
                    deserialize(value)
                else
                    value
                end
            end

            def dump(value)
                if value.is_a?(Array)
                    value.map{|v| serialize(v)}
                elsif value.is_a?(MessageLimit::Limit)
                    serialize(value)
                else
                    value
                end
            end

            private

            def serialize(value)
                if value.is_a?(MessageLimit::Limit)
                    value.dump
                else
                    value
                end
            end

            def deserialize(value)
                limit = MessageLimit::Limit.new(value)
                if limit.valid?
                    limit
                else
                    nil
                end
            end
        end
    end
end
