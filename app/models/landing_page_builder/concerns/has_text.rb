module LandingPageBuilder
    module Concerns
        module HasText
            extend ActiveSupport::Concern

            included do
                attribute :text, String
                attribute :text_alignment, LandingPageBuilder::Alignment, default: { horizontal: 'center', vertical: 'middle' }
                attribute :text_offset, LandingPageBuilder::Offset, default: {}
                attribute :text_color, LandingPageBuilder::Color, default: { red: 129, green: 129, blue: 129 }
                attribute :text_font_size, Integer, default: 16
                attribute :text_font_weight, Integer, default: 400

                def text_equal?(other)
                    (
                        text == other.text &&
                        text_alignment == other.text_alignment &&
                        text_offset == other.text_offset &&
                        text_color == other.text_color &&
                        text_font_size == other.text_font_size &&
                        text_font_weight == other.text_font_weight
                    )
                end

            end
        end
    end
end
