module LandingPageBuilder
    module Concerns
        module HasBorder
            extend ActiveSupport::Concern

            included do
                attribute :border_color, LandingPageBuilder::Color, default: { red: 129, green: 129, blue: 129 }
                attribute :border_width, Float, default: 1
                attribute :border_height, Float, default: 0
                attribute :border_radius, Integer

                def border_equal?(other)
                    (
                        border_color == other.border_color &&
                        border_width == other.border_width &&
                        border_height == other.border_height &&
                        border_radius == other.border_radius
                    )
                end
            end

        end
    end
end
