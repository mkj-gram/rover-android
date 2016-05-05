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



        attribute :autoHeight, Boolean
        attribute :height, Float
        attribute :blocks, Array[LandingPageTemplateBuilder::Block]


        def to_json(opts ={})
            {
                autoHeight: autoHeight,
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

    end
end
