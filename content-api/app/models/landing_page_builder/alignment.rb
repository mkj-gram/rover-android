module LandingPageBuilder
    class Alignment
        include Virtus.model

        attribute :horizontal, String, default: "left"
        attribute :vertical, String, default: "top"


        def ==(other)
            return false if other.nil?
            (
                self.horizontal == other.horizontal &&
                self.vertical == other.vertical
            )
        end

    end
end
