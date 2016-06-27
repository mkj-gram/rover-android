module LandingPageBuilder
    class Screen
        include Virtus.model

        attribute :title, String
        attribute :rows, Array[LandingPageBuilder::Row]
        attribute :background_color, LandingPageBuilder::Color, default: { red: 255 , green: 255, blue: 255 }

        def ==(other)
            return false if other.nil?
            (
                self.title == other.title &&
                self.rows == other.rows &&
                self.background_color == other.background_color
            )
        end
    end
end
