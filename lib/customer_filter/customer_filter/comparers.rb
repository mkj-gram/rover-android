require 'customer_filter/comparers/methods'
require 'customer_filter/comparers/comparer'
require 'customer_filter/comparers/string'
require 'customer_filter/comparers/date'
require 'customer_filter/comparers/boolean'
require 'customer_filter/comparers/integer'
require 'customer_filter/comparers/float'
require 'customer_filter/comparers/array'
require 'customer_filter/comparers/hash'

module CustomerFilter
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
                when :geo_pont
                    geo_pont(opts)
                else
                    return nil
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
                CustomerFilter::Comparers::String.new(opts)
            end

            def boolean(opts)
                CustomerFilter::Comparers::Boolean.new(opts)
            end

            def integer(opts)
                CustomerFilter::Comparers::Integer.new(opts)
            end

            def float(opts)
                CustomerFilter::Comparers::Float.new(opts)
            end

            def hash(opts)
                CustomerFilter::Comparers::Hash.new(opts)
            end

            def array(opts)
                CustomerFilter::Comparers::Array.new(opts)
            end

            def date(opts)
                CustomerFilter::Comparers::Date.new(opts)
            end

            def geo_point(opts)
                CustomerFilter::Comparers::GeoPoint.new(opts)
            end

        end
    end
end
