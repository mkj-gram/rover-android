module LandingPageBuilder
    class Image
        include Virtus.model

        attribute :height, Integer
        attribute :width, Integer
        attribute :type, String
        attribute :name, String
        attribute :size, Integer
        attribute :url, String

        def ==(other)
            return false if other.nil?
            (
                height == other.height &&
                width == other.width &&
                type == other.type &&
                name == other.name &&
                size == other.size &&
                url == other.url
            )
        end

    end
end
