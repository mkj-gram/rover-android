module LandingPageBuilder
    module Blocks
        class ButtonBlock < Block
            include Virtus.model

            attribute :title_text, String, default: 'Button'
            attribute :title_alignment, LandingPageBuilder::Alignment, default: { horizontal: 'center', vertical: 'middle' }
            attribute :title_offset, LandingPageBuilder::Offset
            attribute :title_color, LandingPageBuilder::Color, default: { red: 255, green: 255, blue: 255, alpha: 1.0 }
            attribute :title_font_size, Integer, default: 16
            attribute :title_font_weight, Integer, default: 700


            def ==(other)
                return false if other.nil?
                (
                    super &&
                    self.title_text == other.title_text &&
                    self.title_alignment == other.title_alignment &&
                    self.title_offset == other.title_offset &&
                    self.title_color == other.title_color &&
                    self.title_font_size == other.title_font_size &&
                    self.title_font_weight == other.title_font_weight
                )
            end

        end
    end
end
