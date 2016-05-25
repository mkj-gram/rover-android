module JSONHash
    class << self

        def load(obj)
            return {} if obj.nil?
            return obj if !obj.is_a?(String)
            return JSON.parse(obj)
        end

        def dump(obj)
            return nil if obj.nil?
            return obj if !obj.is_a?(String)
            return JSON.dump(obj)
        end
    end
end
