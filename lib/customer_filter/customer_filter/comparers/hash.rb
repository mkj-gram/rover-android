module CustomerFilter
    module Comparers
        class Hash < Comparer

            def check(v)
                if v.is_a?(Hash)
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
                else
                    # a path was given for a specific key to check
                    # this value could be any value
                    # want to map which ever value to a comparer
                    # and check
                    tmp_comparer = CustomerFilter::Comparers.build_with_type(self.dump, CustomerFilter::Comparers.get_type(v))
                    if tmp_comparer
                        tmp_comparer.check(v)
                    else
                        false
                    end
                end
            end
        end
    end
end
