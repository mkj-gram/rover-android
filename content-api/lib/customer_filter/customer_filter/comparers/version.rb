module CustomerFilter
    module Comparers
        class Version < Comparer

            def check(v)
                case @method
                when Comparers::Methods::EQUAL
                    v == @value
                when Comparers::Methods::NOT_EQUAL
                    v != @value
                when Comparers::Methods::ANY_VALUE
                    true
                when Comparers::Methods::EXISTS
                    !v.nil?
                when Comparers::Methods::DOES_NOT_EXIST
                    v.nil?
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
                                            "#{attribute_name}.major" => @value[:major] || @value["major"]
                                        }
                                    },
                                    {
                                        term: {
                                            "#{attribute_name}.minor" => @value[:minor] || @value["minor"]
                                        }
                                    },
                                    {
                                        term: {
                                            "#{attribute_name}.revision" => @value[:revision] || @value["revision"]
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
                                            "#{attribute_name}.major" => @value[:major] || @value["major"]
                                        }
                                    },
                                    {
                                        term: {
                                            "#{attribute_name}.minor" => @value[:minor] || @value["minor"]
                                        }
                                    },
                                    {
                                        term: {
                                            "#{attribute_name}.revision" => @value[:revision] || @value["revision"]
                                        }
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
                when Comparers::Methods::EXISTS
                    {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        exists: {
                                            field: attribute_name
                                        }
                                    }
                                ]
                            }
                        }
                    }
                when Comparers::Methods::DOES_NOT_EXIST
                    {
                        filter: {
                            bool: {
                                must_not: [
                                    {
                                        exists: {
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
