module LandingPageBuilder
    class Font
        include Virtus.model

        attribute :size, Integer, default: 16
        attribute :weight, Integer, default: 400


        def ==(other)
            return false if other.nil?
            (
                size == other.size &&
                weight == other.weight
            )
        end

    end
end
