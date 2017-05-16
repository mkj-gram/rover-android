module JSONHash
    class << self

        def load(obj)
            return {} if obj.nil?
            return obj.with_indifferent_access if obj.is_a?(Hash)
            return Oj.load(obj).with_indifferent_access if obj.is_a?(String)
            return {}
        end

        def dump(obj)
            return nil if obj.nil?
            return obj if !obj.is_a?(Hash)
            return Oj.dump(obj)
        end
    end
end
