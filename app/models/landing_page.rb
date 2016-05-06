class LandingPage
    include Virtus.model


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

    end

    class Row
        include Virtus.model

        attribute :auto_height, Boolean
        attribute :height, Float
        attribute :blocks, Array[LandingPage::Block]
    end



    attribute :title, String
    attribute :rows, Array[LandingPage::Row]


    def to_doc
        JSON.parse(to_json)
    end

    def to_json(opts ={})
        super
    end

    def as_json(opts = {})
        json = super
        json.dasherize! if opts[:dasherize]
        json
    end

end
