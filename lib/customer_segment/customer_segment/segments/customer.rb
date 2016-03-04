module CustomerSegment
    module Segments
        class Customer < Segment
            # field :name, type: String
            # field :email, type: String
            # field :phone_number, type: String
            # field :tags, type: Array
            # field :traits, type: Hash

            @@attribute_index = {
                "name" => :string,
                "email" => :string,
                "phone_number" => :string,
                "tags" => :array,
                "traits" => :hash
            }

            # "name" => CustomerSegment::AttributeType.new(type: :string),
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
                if opts.has_key?("comparer")
                    @comparer = CustomerSegment::Comparers.build_with_type(opts["comparer"], attribute_index[attribute_name])
                end
            end

            def within_segment(customer)
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
