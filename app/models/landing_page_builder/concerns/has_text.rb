module LandingPageBuilder
    module Concerns
        module HasText
            extend ActiveSupport::Concern

            included do

                attribute :text, String
                attribute :text_alignment, LandingPageBuilder::Alignment, default: { horizontal: 'center', vertical: 'middle' }
                attribute :text_offset, LandingPageBuilder::Offset, default: {}
                attribute :text_color, LandingPageBuilder::Color, default: { red: 129, green: 129, blue: 129 }
                attribute :text_font, LandingPageBuilder::Font, default: { size: 16, weight: 400 }

                def text_equal?(other)
                    (
                        text == other.text &&
                        text_alignment == other.text_alignment &&
                        text_offset == other.text_offset &&
                        text_color == other.text_color &&
                        text_font == other.text_font
                    )
                end

            end
        end
    end
end
