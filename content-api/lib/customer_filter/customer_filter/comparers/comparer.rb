module CustomerFilter
    module Comparers
        class Comparer

            attr_reader :method, :value

            def initialize(opts)
                @value = opts["value"]
                @method = opts["method"]
            end

            def dump
                {
                    "method" => method,
                    "value" => value
                }.merge(extra_opts)
            end

            # used for comparers which implent extra options
            def extra_opts
                {}
            end

            def ==(other)
                self.dump == other.dump
            end

            def eql(other)
                self == other
            end
        end
    end
end
