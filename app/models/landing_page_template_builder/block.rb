module LandingPageTemplateBuilder
    class Block
        include Virtus.model


        attribute :type, String

        attribute :auto_height, Boolean, default: false
        attribute :auto_width, Boolean, default: false
        attribute :width, Integer, default: 170
        attribute :height, Integer, default: 280

        # Layout
        attribute :layout, String, default: "stacked"
        attribute :horizontal_alignment, String, default: "left"
        attribute :vertical_alignment, String, default: "top"

        # offsets
        attribute :offset_top, Integer, default: 20
        attribute :offset_bottom, Integer, default: 20
        attribute :offset_left, Integer, default: 20
        attribute :offset_right, Integer, default: 20
        attribute :offset_center, Integer
        attribute :offset_middle, Integer

        # Background
        attribute :background_red, Integer, default: 216
        attribute :background_green, Integer, default: 216
        attribute :background_blue, Integer, default: 216
        attribute :background_alpha, Float, default: 1.0
        attribute :background_image_path, String
        attribute :background_content_mode, String, default: "tile"

        # border
        attribute :border_red, Integer, default: 151
        attribute :border_green, Integer, default: 151
        attribute :border_blue, Integer, default: 151
        attribute :border_alpha, Float, default: 1.0
        attribute :border_width, Integer, default: 1
        attribute :border_radius, Integer, default: 0

        # Button Block
        attribute :title, String
        attribute :title_font_weight, Integer, default: 500
        attribute :title_red, Integer, default: 255
        attribute :title_green, Integer, default: 255
        attribute :title_blue, Integer, default: 255
        attribute :title_alpha, Float, default: 1.0

        # Text Block
        attribute :text, String

        def render(opts = {})
            # renders the block
            {
                type: type,

                auto_height: auto_height,
                auto_width: auto_width,
                width: width,
                height: height,

                # Layout
                layout: layout,
                horizontal_alignment: horizontal_alignment,
                vertical_alignment: vertical_alignment,

                # offsets
                offset_top: offset_top,
                offset_bottom: offset_bottom,
                offset_left: offset_left,
                offset_right: offset_right,
                offset_center: offset_center,
                offset_middle: offset_middle,

                # Background
                background_red: background_red,
                background_green: background_green,
                background_blue: background_blue,
                background_alpha: background_alpha,
                background_image_path: background_image_path,
                background_content_mode: background_content_mode,

                # border
                border_red: border_red,
                border_green: border_green,
                border_blue: border_blue,
                border_alpha: border_alpha,
                border_width: border_width,
                border_radius: border_radius,

                # Button Block
                title: TemplateHelper.render_string(title, opts),
                title_font_weight: title_font_weight,
                title_red: title_red,
                title_green: title_green,
                title_blue: title_blue,
                title_alpha: title_alpha,


                text: TemplateHelper.render_string(text, opts),


            }
        end

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
                self.background_red == other.background_red &&
                self.background_green == other.background_green &&
                self.background_blue == other.background_blue &&
                self.background_alpha == other.background_alpha &&
                self.background_image_path == other.background_image_path &&
                self.background_content_mode == other.background_content_mode &&
                self.border_red == other.border_red &&
                self.border_green == other.border_green &&
                self.border_blue == other.border_blue &&
                self.border_alpha == other.border_alpha &&
                self.border_width == other.border_width &&
                self.border_radius == other.border_radius &&
                self.title == other.title &&
                self.title_red == other.title_red &&
                self.title_green == other.title_green &&
                self.title_blue == other.title_blue &&
                self.title_alpha == other.title_alpha &&
                self.title_font_weight == other.title_font_weight &&
                self.text == other.text
            )
        end

    end
end
