module CustomerFilter
    module Comparers
        class Array < Comparer

            def check(v)
                case @method
                when Comparers::Methods::EQUAL
                    v == @value
                when Comparers::Methods::NOT_EQUAL
                    v != @value
                when Comparers::Methods::CONTAINS
                    v.include?(@value)
                when Comparers::Methods::DOES_NOT_CONTAIN
                    !v.include?(@value)
                when Comparers::Methods::ANY_VALUE
                    true
                when Comparers::Methods::UNKNOWN_VALUE
                    v.nil?
                else
                    false
                end

            end
        end
    end
end
