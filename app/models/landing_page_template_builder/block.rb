module LandingPageTemplateBuilder
    class Block
        include Virtus.model


        attribute :type, String

        attribute :autoHeight, Boolean, default: false
        attribute :autoWidth, Boolean, default: false
        attribute :width, Integer, default: 170
        attribute :height, Integer, default: 280

        # Layout
        attribute :layout, String, default: "stacked"
        attribute :horizontalAlignment, String, default: "left"
        attribute :verticalAlignment, String, default: "top"

        # offsets
        attribute :offsetTop, Integer, default: 20
        attribute :offsetBottom, Integer, default: 20
        attribute :offsetLeft, Integer, default: 20
        attribute :offsetRight, Integer, default: 20
        attribute :offsetCenter, Integer
        attribute :offsetMiddle, Integer

        # Background
        attribute :backgroundRed, Integer, default: 216
        attribute :backgroundGreen, Integer, default: 216
        attribute :backgroundBlue, Integer, default: 216
        attribute :backgroundAlpha, Float, default: 1.0
        attribute :backgroundImagePath, String
        attribute :backgroundContentMode, String, default: "tile"

        # border
        attribute :borderRed, Integer, default: 151
        attribute :borderGreen, Integer, default: 151
        attribute :borderBlue, Integer, default: 151
        attribute :borderAlpha, Float, default: 1.0
        attribute :borderWidth, Integer, default: 1
        attribute :borderRadius, Integer, default: 0

        # Button Block
        attribute :title, String
        attribute :titleFontWeight, Integer, default: 500
        attribute :titleRed, Integer, default: 255
        attribute :titleGreen, Integer, default: 255
        attribute :titleBlue, Integer, default: 255
        attribute :titleAlpha, Float, default: 1.0

        # Text Block
        attribute :text, String

        def render(opts = {})
            # renders the block
            {
                type: type,

                autoHeight: autoHeight,
                autoWidth: autoWidth,
                width: width,
                height: height,

                # Layout
                layout: layout,
                horizontalAlignment: horizontalAlignment,
                verticalAlignment: verticalAlignment,

                # offsets
                offsetTop: offsetTop,
                offsetBottom: offsetBottom,
                offsetLeft: offsetLeft,
                offsetRight: offsetRight,
                offsetCenter: offsetCenter,
                offsetMiddle: offsetMiddle,

                # Background
                backgroundRed: backgroundRed,
                backgroundGreen: backgroundGreen,
                backgroundBlue: backgroundBlue,
                backgroundAlpha: backgroundAlpha,
                backgroundImagePath: backgroundImagePath,
                backgroundContentMode: backgroundContentMode,

                # border
                borderRed: borderRed,
                borderGreen: borderGreen,
                borderBlue: borderBlue,
                borderAlpha: borderAlpha,
                borderWidth: borderWidth,
                borderRadius: borderRadius,

                # Button Block
                title: TemplateHelper.render_string(title, opts),
                titleFontWeight: titleFontWeight,
                titleRed: titleRed,
                titleGreen: titleGreen,
                titleBlue: titleBlue,
                titleAlpha: titleAlpha,


                text: TemplateHelper.render_string(text, opts),


            }
        end

        def ==(other)
            return false if other.nil? || !other.is_a?(LandingPageTemplateBuilder::Block)
            (
                self.type == other.type &&
                self.autoHeight == other.autoHeight &&
                self.autoWidth == other.autoWidth &&
                self.width == other.width &&
                self.height == other.height &&
                self.layout == other.layout &&
                self.horizontalAlignment == other.horizontalAlignment &&
                self.verticalAlignment == other.verticalAlignment &&
                self.offsetTop == other.offsetTop &&
                self.offsetBottom == other.offsetBottom &&
                self.offsetLeft == other.offsetLeft &&
                self.offsetRight == other.offsetRight &&
                self.offsetCenter == other.offsetCenter &&
                self.offsetMiddle == other.offsetMiddle &&
                self.backgroundRed == other.backgroundRed &&
                self.backgroundGreen == other.backgroundGreen &&
                self.backgroundBlue == other.backgroundBlue &&
                self.backgroundAlpha == other.backgroundAlpha &&
                self.backgroundImagePath == other.backgroundImagePath &&
                self.backgroundContentMode == other.backgroundContentMode &&
                self.borderRed == other.borderRed &&
                self.borderGreen == other.borderGreen &&
                self.borderBlue == other.borderBlue &&
                self.borderAlpha == other.borderAlpha &&
                self.borderWidth == other.borderWidth &&
                self.borderRadius == other.borderRadius &&
                self.title == other.title &&
                self.titleRed == other.titleRed &&
                self.titleGreen == other.titleGreen &&
                self.titleBlue == other.titleBlue &&
                self.titleAlpha == other.titleAlpha &&
                self.titleFontWeight == other.titleFontWeight &&
                self.text == other.text
            )
        end

    end
end
