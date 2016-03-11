module CustomerSegment
    module Comparers
        class String < Comparer

            def check(v)
                case @method
                when Comparers::Methods::EQUAL
                    v == @value
                when Comparers::Methods::NOT_EQUAL
                    v != @value
                when Comparers::Methods::STARTS_WITH
                    v.starts_with?(@value)
                when Comparers::Methods::ENDS_WITH
                    v.ends_with?(@value)
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
                when Comparers::Methods::STARTS_WITH
                    {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        prefix: {
                                            attribute_name => {
                                                value: @value
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                when Comparers::Methods::ENDS_WITH
                    {
                        filter: {
                            bool: {
                                must: [
                                    prefix: {
                                        "#{attribute_name}.reversed" => {
                                            value: @value.reverse # seems like a bug with elasticsearch not reversing for us
                                        }
                                    }
                                ]
                            }
                        }
                    }
                when Comparers::Methods::CONTAINS
                    {
                        query: {
                            match_phrase_prefix: {
                                "#{attribute_name}.ngrams" => @value
                            }
                        }
                    }
                when Comparers::Methods::DOES_NOT_CONTAIN
                    {
                        query: {
                            bool: {
                                must_not: [
                                    match_phrase_prefix: {
                                        "#{attribute_name}.ngrams" => @value
                                    }
                                ]
                            }
                        }
                    }
                when Comparers::Methods::ANY_VALUE
                    {
                        query: {
                            match_all: {}
                        }
                    }
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
