module LandingPageBuilder
    class Block
        include Virtus.model

        attribute :type, String

        attribute :width, LandingPageBuilder::Unit, default: { value: 170, type: "points" }
        attribute :height, LandingPageBuilder::Unit, default: { value: 280, type: "points" }

        # Layout
        attribute :layout, String, default: "stacked"
        attribute :horizontal_alignment, String, default: "left"
        attribute :vertical_alignment, String, default: "top"

        # offsets
        attribute :offset_top, LandingPageBuilder::Unit, default: { value: 20, type: "points" }
        attribute :offset_bottom, LandingPageBuilder::Unit, default: { value: 20, type: "points" }
        attribute :offset_left, LandingPageBuilder::Unit, default: { value: 20, type: "points" }
        attribute :offset_right, LandingPageBuilder::Unit, default: { value: 20, type: "points" }
        attribute :offset_center, LandingPageBuilder::Unit, default: { value: 0, type: "points" }
        attribute :offset_middle, LandingPageBuilder::Unit, default: { value: 0, type: "points" }

        # Background
        attribute :background_color, LandingPageBuilder::Color, default: { red: 216, green: 216, blue: 216, alpha: 1.0 }
        attribute :background_image_path, String
        attribute :background_content_mode, String, default: "tile"

        # border
        attribute :border_color, LandingPageBuilder::Color, default: { red: 151, green: 151, blue: 151, alpha: 1.0 }
        attribute :border_width, Float, default: 1.0
        attribute :border_radius, Float, default: 1.0

        # Button Block
        attribute :title, String
        attribute :title_font_size, Integer, default: 16
        attribute :title_font_weight, Integer, default: 500
        attribute :title_color, LandingPageBuilder::Color, default: { red: 255, green: 255, blue: 255, alpha: 1.0 }

        # Text Block
        attribute :text, String



        def ==(other)
            return false if other.nil? || !other.is_a?(LandingPageTemplateBuilder::Block)
            (
                self.type == other.type &&
                self.auto_height == other.auto_height &&
                self.auto_width == other.auto_width &&
                self.width == other.width &&
                self.height == other.height &&
                self.layout == other.layout &&
                self.horizontal_alignment == other.horizontal_alignment &&
                self.vertical_alignment == other.vertical_alignment &&
                self.offset_top == other.offset_top &&
                self.offset_bottom == other.offset_bottom &&
                self.offset_left == other.offset_left &&
                self.offset_right == other.offset_right &&
                self.offset_center == other.offset_center &&
                self.offset_middle == other.offset_middle &&
                self.background_color == other.background_color &&
                self.background_content_mode == other.background_content_mode &&
                self.border_color == other.border_color &&
                self.border_width == other.border_width &&
                self.border_radius == other.border_radius &&
                self.title == other.title &&
                self.title_color == other.title_color &&
                self.title_font_weight == other.title_font_weight &&
                self.text == other.text
            )
        end

    end
end
