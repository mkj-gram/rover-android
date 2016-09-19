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


             def get_elasticsearch_query(attribute_name)

                if @value.is_a?(Array)
                    filter_function = :terms
                else
                    filter_function = :term
                end

                case @method
                when Comparers::Methods::CONTAINS
                    {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        filter_function => {
                                            attribute_name => @value
                                        }
                                    }
                                ]
                            }
                        }
                    }
                when Comparers::Methods::DOES_NOT_CONTAIN
                    {
                        filter: {
                            bool: {
                                must_not: [
                                    {
                                        filter_function => {
                                            attribute_name => @value
                                        }
                                    }
                                ]
                            }
                        }
                    }
                else
                    {}
                end
            end
        end
    end
end
