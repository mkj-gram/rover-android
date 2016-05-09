module LandingPageBuilder
    class Row
        include Virtus.model

        attribute :height, LandingPageBuilder::Unit
        attribute :blocks, Array[LandingPageBuilder::Blocks::Block]

        def ==(other)
            return false if other.nil?
            (
                self.height == other.height &&
                self.blocks == other.blocks
            )
        end

        def blocks=(new_blocks)
            super new_blocks.map{|block_args| LandingPageBuilder::BlockBuilder.new(block_args)}
        end

    end
end
