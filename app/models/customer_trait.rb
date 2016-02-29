class CustomerTrait

    attr_reader :trait_key,

    def initialize(opts = {})
        @trait_key = opts.delete(:trait_key)
        if opts.has_key?(:trait_type)
            @trait_type = opts.delete(:trait_type)
        else
            value = opts.delete(:value)
            set_trait_type!(value)
        end
    end

    def trait_type
        @trait_type.to_s
    end

    private

    def set_trait_type!(value)
        @trait_type = case value
        when TrueClass
            :boolean
        when FalseClass
            :boolean
        when Fixnum
            :integer
        when Float
            :float
        when String
            :string
        when Hash
            :hash
        when Array
            :array
        end
    end
end
