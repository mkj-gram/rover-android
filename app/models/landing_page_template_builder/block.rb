module LandingPageTemplateBuilder
    class Block
        include Virtus.model

        attribute :autoHeight, Boolean, default: false
        attribute :autoWidth, Boolean, default: false
        attribute :backgroundRed, Integer, default: 255
        attribute :backgroundGreen, Integer, default: 255
        attribute :backgroundBlue, Integer, default: 255
        attribute :backgroundAlpha, Float, default: 1
        attribute :backgroundImagePath, String
        attribute :backgroundContentMode, String
        attribute :borderRed, Integer, default: 255
        attribute :borderGreen, Integer, default: 255
        attribute :borderBlue, Integer, default: 255
        attribute :borderAlpha, Float, default: 1
        attribute :borderWidth, Integer, default: 1
        attribute :borderRadius, Integer, default: 0
        attribute :height, Integer
        attribute :horizontalAlignment, String
        attribute :layout, String
        attribute :marginBottom, Integer
        attribute :marginLeft, Integer
        attribute :marginRight, Integer
        attribute :marginTop, Integer
        attribute :verticalAlignment, String
        attribute :width, Integer
        attribute :type, String

    end
end
