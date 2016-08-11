module Experiences
    class Unit
        include Virtus.model

        attribute :value, Float
        attribute :type, String, default: "points"

        def to_doc
            {
                value: value,
                type: type
            }
        end
    end
end
