module LandingPageBuilder
    class Row
        include Virtus.model

        attribute :height, LandingPageBuilder::Unit
        attribute :blocks, Array[LandingPageBuilder::Block]

        def ==(other)
            return false if other.nil?
            (
                self.height == other.height &&
                self.blocks == other.blocks
            )
        end

    end
end
