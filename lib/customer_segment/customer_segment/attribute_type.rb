module CustomerSegment
    class AttributeType
        include Virtus.model

        attribute :type, Symbol
        attribute :array, Boolean, default: false
    end
end
