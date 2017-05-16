module CustomerFilter
    module Comparers
        class Float < Comparer

            def check(v)
                case @method
                when Comparers::Methods::EQUAL
                    v == @value
                when Comparers::Methods::NOT_EQUAL
                    v != @value
                when Comparers::Methods::ANY_VALUE
                    true
                when Comparers::Methods::UNKNOWN_VALUE
                    v.nil?
                when Comparers::Methods::LESS_THAN
                    v < @value
                when Comparers::Methods::LESS_THAN_OR_EQUAL
                    v <= @value
                when Comparers::Methods::GREATER_THAN
                    v > @value
                when Comparers::Methods::GREATER_THAN_OR_EQUAL
                    v >= @value
                else
                    false
                end

            end

        end
    end
end
