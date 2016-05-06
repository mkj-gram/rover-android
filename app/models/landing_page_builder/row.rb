module LandingPageBuilder
    class Row
        include Virtus.model

        attribute :height, LandingPageBuilder::Unit
        attribute :blocks, Array[LandingPageBuilder::Block]

        def ==(other)
            return false if other.nil?
            (
                self.auto_height == other.auto_height &&
                self.height == other.height &&
                self.blocks == other.blocks
            )
        end

    end
end
