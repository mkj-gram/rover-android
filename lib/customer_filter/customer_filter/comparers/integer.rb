module CustomerFilter
    module Comparers
        class Integer < Comparer

            def initialize(opts)
                super
                @from = opts["from"]
                @to = opts["to"]
            end

            def lower_bound
                @from
            end

            def upper_bound
                @to
            end

            def range?
                lower_bound || upper_bound
            end

            def dump
                opts = super
                if range?
                    opts.delete("value")
                    opts.merge!(
                        {
                            "from" => lower_bound,
                            "to" => upper_bound
                        }
                    )
                end
                return opts
            end


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
                when Comparers::Methods::RANGE
                    range.include?(v)
                else
                    false
                end

            end

            def extra_opts
                if lower_bound && upper_bound
                    {"from" => lower_bound, "to" => upper_bound}
                else
                    {}
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
                    # when the value is neste
                    # {
                    #     filter: {
                    #         nested: {
                    #             path: "devices",
                    #             filter: {
                    #                 missing: {
                    #                     field: attribute_name
                    #                 }
                    #             }
                    #         }
                    #     }
                    # }
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
                when Comparers::Methods::LESS_THAN
                    {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        range: {
                                            attribute_name => {
                                                lt: @value
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                when Comparers::Methods::LESS_THAN_OR_EQUAL
                    {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        range: {
                                            attribute_name => {
                                                lte: @value
                                            }
                                        }
                                    }
                                ]
                            }

                        }
                    }
                when Comparers::Methods::GREATER_THAN
                    {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        range: {
                                            attribute_name => {
                                                gt: @value
                                            }
                                        }
                                    }
                                ]
                            }

                        }
                    }
                when Comparers::Methods::GREATER_THAN_OR_EQUAL
                    {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        range: {
                                            attribute_name => {
                                                gte: @value
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                when Comparers::Methods::RANGE
                    {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        range: {
                                            attribute_name => {
                                                from: lower_bound,
                                                to: upper_bound
                                            }
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
