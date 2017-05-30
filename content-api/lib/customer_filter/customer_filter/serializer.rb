module CustomerFilter
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
                if value.is_a?(Array) && value.first.is_a?(CustomerFilter::Filters::Filter)
                    value.map{|v| serialize(v)}
                elsif value.is_a?(CustomerFilter::Filters::Filter)
                    serialize(value)
                else
                    value
                end
            end

            private

            def serialize(value)
                value.dump
            end

            def deserialize(value)
                return nil if !value.is_a?(Hash)
                CustomerFilter::Filters.build(value)
            end
        end
    end
end