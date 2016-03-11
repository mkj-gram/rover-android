module CustomerSegment
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
        end
    end
end
