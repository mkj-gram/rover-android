require 'customer_segment/comparers/methods'
require 'customer_segment/comparers/comparer'
require 'customer_segment/comparers/string'
require 'customer_segment/comparers/date'
require 'customer_segment/comparers/boolean'
require 'customer_segment/comparers/integer'
require 'customer_segment/comparers/float'
require 'customer_segment/comparers/array'
require 'customer_segment/comparers/hash'

module CustomerSegment
    module Comparers
        class << self

            def build_with_type(opts, type)
                # type is now an AttributeType
                # do we need this?
                # an array contains? means include?
                case type
                when :string
                    string(opts)
                when :boolean
                    boolean(opts)
                when :hash
                    hash(opts)
                when :array
                    array(opts)
                when :date
                    date(opts)
                when :integer
                    integer(opts)
                when :float
                    float(opts)
                end
            end

            def get_type(value)
                case value
                when ::String
                    :string
                when ::TrueClass, ::FalseClass
                    :boolean
                when ::Array
                    :array
                when ::Hash
                    :hash
                when ::DateTime, ::Time
                    :date
                when ::Fixnum
                    :integer
                when ::Float
                    :float
                end
            end

            def string(opts)
                CustomerSegment::Comparers::String.new(opts)
            end

            def boolean(opts)
                CustomerSegment::Comparers::Boolean.new(opts)
            end

            def integer(opts)
                CustomerSegment::Comparers::Integer.new(opts)
            end

            def float(opts)
                CustomerSegment::Comparers::Float.new(opts)
            end

            def hash(opts)
                CustomerSegment::Comparers::Hash.new(opts)
            end

            def array(opts)
                CustomerSegment::Comparers::Array.new(opts)
            end

            def date(opts)
                CustomerSegment::Comparers::Date.new(opts)
            end

        end
    end
end
