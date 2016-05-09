module LandingPageBuilder
    module Blocks
        class ButtonBlock < Block
            include Virtus.model

            attribute :title, String
            attribute :title_font_size, Integer, default: 16
            attribute :title_font_weight, Integer, default: 500
            attribute :title_color, LandingPageBuilder::Color, default: { red: 255, green: 255, blue: 255, alpha: 1.0 }

            def ==(other)
                return false if other.nil?
                (
                    super &&
                    self.title == other.title &&
                    self.title_font_weight == other.title_font_weight &&
                    self.title_font_size == other.title_font_size &&
                    self.title_color == other.title_color
                )

            end
        end
    end
end
