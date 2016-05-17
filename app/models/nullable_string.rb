class NullableString < Virtus::Attribute
    def coerce(value)
        return nil if value.nil?
        value.empty? ? nil : value
    end
end
