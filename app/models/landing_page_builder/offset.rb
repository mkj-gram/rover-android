module LandingPageBuilder
    class Offset
        include Virtus.model

        attribute :top, LandingPageBuilder::Unit, default: { value: 0, type: "points" }
        attribute :right, LandingPageBuilder::Unit, default: { value: 0, type: "points" }
        attribute :bottom, LandingPageBuilder::Unit, default: { value: 0, type: "points" }
        attribute :left, LandingPageBuilder::Unit, default: { value: 0, type: "points" }
        attribute :center, LandingPageBuilder::Unit, default: { value: 0, type: "points" }
        attribute :middle, LandingPageBuilder::Unit, default: { value: 0, type: "points" }


        def ==(other)
            return false if other.nil?
            (
                self.top == other.top &&
                self.right == other.right &&
                self.bottom == other.bottom &&
                self.left == other.left &&
                self.center == other.center &&
                self.middle == other.middle
            )
        end

    end
end
