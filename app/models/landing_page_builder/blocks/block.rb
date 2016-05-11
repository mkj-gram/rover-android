module LandingPageBuilder
    module Blocks
        class Block
            include Virtus.model

            attribute :type, String

            attribute :width, LandingPageBuilder::Unit, default: { value: 170, type: "points" }
            attribute :height, LandingPageBuilder::Unit, default: { value: 280, type: "points" }

            # Layout
            attribute :position, String, default: "stacked"
            attribute :alignment, LandingPageBuilder::Alignment, default: { horizontal: "fill" }

            # offsets
            attribute :offset, LandingPageBuilder::Offset, default: { top: { value: 20 } , right: { value: 20 }, bottom: { value: 20 }, left: { value: 20 } }

            # Background
            attribute :background_color, LandingPageBuilder::Color, default: { red: 216, green: 216, blue: 216, alpha: 1.0 }
            attribute :background_image_path, String
            attribute :background_content_mode, String, default: "tile"

            # border
            attribute :border_color, LandingPageBuilder::Color, default: { red: 151, green: 151, blue: 151, alpha: 1.0 }
            attribute :border_width, Float, default: 1.0
            attribute :border_radius, Float, default: 1.0

            attribute :action, LandingPageBuilder::Actions::Action

            def ==(other)
                return false if other.nil?
                (
                    self.type == other.type &&
                    self.width == other.width &&
                    self.height == other.height &&
                    self.position == other.position &&
                    self.alignment == other.alignment &&
                    self.offset == other.offset &&
                    self.background_color == other.background_color &&
                    self.background_content_mode == other.background_content_mode &&
                    self.border_color == other.border_color &&
                    self.border_width == other.border_width &&
                    self.border_radius == other.border_radius &&
                    self.action == other.action
                )
            end

            def action=(new_action)
                return if new_action.nil?
                super LandingPageBuilder::Actions::ActionBuilder.new(new_action)
            end

        end
    end
end
