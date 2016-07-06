module CustomerFilter
    module Filters
        class Customer < Filter
            # field :name, type: String
            # field :email, type: String
            # field :phone_number, type: String
            # field :tags, type: Array
            # field :traits, type: Hash

            @@attribute_index = {
                "first_name" => :string,
                "last_name" => :string,
                "email" => :string,
                "phone_number" => :string,
                "tags" => :array,
                "traits" => :hash,
                "gender" => :string,
                "age" => :integer,
                "location" => :geofence
            }

            # "name" => CustomerFilter::AttributeType.new(type: :string),
            # "email" => AttributeType.new(type: :string),
            # "phone_number" => AttributeType.new(type: :string),
            # "tags" => AttributeType.new(type: :string, array: true),
            # "traits" => AttributeType.new(type: :hash)
            # we don't know the hash :(
            # hashs are dynamic
            # {my_string: "1", my_integer: 2, my_array: ["123", "123"], my_date: "2016-08-123"}


            def model_name
                "customer"
            end

            def attribute_index
                @@attribute_index
            end

            def initialize(opts)
                super
                @model = self.model_name
                if opts.has_key?("comparer")
                    @comparer = CustomerFilter::Comparers.build_with_type(opts["comparer"], attribute_index[formatted_attribute_name])
                end
                return nil if @comparer.nil?
            end

            def compute_filter_count(account)
                # use the comparer to build an elasticsearch query
                # find the count
                if @comparer
                    query = {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            account_id: account.id
                                        }
                                    }
                                ]
                            }
                        }
                    }
                    query.deep_merge!(@comparer.get_elasticsearch_query(formatted_attribute_name)) {|k, a, b| a.is_a?(Array) && b.is_a?(Array) ? a + b : b}
                    @segment_count = Elasticsearch::Model.search(query, [::Customer]).count
                    return @segment_count
                else
                    0
                end
            end

            def elasticsearch_query
                if @comparer
                    return @comparer.get_elasticsearch_query(formatted_attribute_name)
                else
                    {}
                end
            end

            def within_filter(opts = {})
                customer = opts[:customer]
                if customer.is_a?(::Customer)
                    value = get_value_for(customer)
                    comparer.check(value)
                else
                    Rails.logger.warn("Attempted to check if #{customer.class.name} existed within a customer segment")
                    false
                end
            end
        end
    end
end
