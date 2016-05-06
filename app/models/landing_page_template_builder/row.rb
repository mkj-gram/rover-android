module LandingPageTemplateBuilder
    class Row
        include Virtus.model

        class << self

            def load(objs)
                return nil if objs.nil?
                return [] if objs.empty?
                objs.map{|obj| Row.new(obj)}
            end

            def dump(objs)
                objs.map(&:to_json)
            end
        end



        attribute :auto_height, Boolean
        attribute :height, Float
        attribute :blocks, Array[LandingPageTemplateBuilder::Block]


        def to_json(opts ={})
            {
                auto_height: auto_height,
                height: height,
                blocks: blocks
            }
        end

        def render(opts ={})
            {
                autoHeight: autoHeight,
                height: height,
                blocks: blocks.map{|block| block.render(opts)}
            }
        end

        def ==(other)
            self.auto_height == other.auto_height && self.height == other.height && self.blocks == other.blocks
        end

    end
end
