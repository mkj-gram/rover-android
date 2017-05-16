module LandingPageBuilder
    class Row
        include Virtus.model

        attribute :height, LandingPageBuilder::Unit
        attribute :blocks, Array[LandingPageBuilder::Blocks::Block]

        def ==(other)
            return false if other.nil?
            (
                self.height == other.height &&
                compare_blocks(other.blocks)
            )
        end

        def blocks=(new_blocks)
            super new_blocks.map{|block_args| LandingPageBuilder::BlockBuilder.new(block_args)}
        end

        private

        def compare_blocks(other_blocks)
            for i in 0..self.blocks.length
                return false if self.blocks[i] != other_blocks[i]
            end

            return true
        end

    end
end
