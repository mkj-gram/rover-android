module CustomerFilter
    module Comparers
        class Boolean < Comparer

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
                else
                    false
                end
            end


            def get_elasticsearch_query(attribute_name)
                case @method
                when Comparers::Methods::EQUAL
                    {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            attribute_name => @value
                                        }
                                    }
                                ]
                            }
                        }
                    }
                when Comparers::Methods::NOT_EQUAL
                    {
                        filter: {
                            bool: {
                                must_not: [
                                    {
                                        term: {
                                            attribute_name => @value
                                        }
                                    }
                                ]
                            }
                        }
                    }
                when Comparers::Methods::ANY_VALUE
                    {}
                when Comparers::Methods::UNKNOWN_VALUE
                    {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        missing: {
                                            field: attribute_name
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
