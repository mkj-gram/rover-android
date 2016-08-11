module Experiences
    class Color
        include Virtus.model

        attribute :red, Integer, default: 255
        attribute :green, Integer, default: 255
        attribute :blue, Integer, default: 255
        attribute :alpha, Float, default: 1.0

        def to_doc
            {
                red: red,
                green: green,
                blue: blue,
                alpha: alpha
            }
        end

    end
end
