module LandingPageBuilder
    class Color
        include Virtus.model

        attribute :red, Integer, default: 255
        attribute :green, Integer, default: 255
        attribute :blue, Integer, default: 255
        attribute :alpha, Float, default: 1.0

        def ==(other)
            (
                self.red == other.red &&
                self.green == other.green &&
                self.blue == other.blue &&
                self.alpha == other.alpha
            )
        end

    end
end
