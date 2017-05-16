module LandingPageBuilder
    module Blocks
        class Block
            include Virtus.model

            attribute :type, String

            attribute :width, LandingPageBuilder::Unit, default: { value: 170, type: "points" }
            attribute :height, LandingPageBuilder::Unit, default: { value: 280, type: "points" }

            # Layout
            attribute :position, String, default: "stacked"
            attribute :alignment, LandingPageBuilder::Alignment, default: { horizontal: "fill" }

            # offsets
            attribute :offset, LandingPageBuilder::Offset, default: { top: { value: 20 } , right: { value: 20 }, bottom: { value: 20 }, left: { value: 20 } }



            def ==(other)
                return false if other.nil?
                (
                    self.type == other.type &&
                    self.width == other.width &&
                    self.height == other.height &&
                    self.position == other.position &&
                    self.alignment == other.alignment &&
                    self.offset == other.offset
                )
            end

        end
    end
end
