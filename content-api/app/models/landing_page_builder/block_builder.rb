module LandingPageBuilder
    class BlockBuilder
        class << self

            def new(args)
                case args["type"]
                when "button-block"
                    Blocks::ButtonBlock.new(args)
                when "text-block"
                    Blocks::TextBlock.new(args)
                when "image-block"
                    Blocks::ImageBlock.new(args)
                else
                    Blocks::Block.new(args)
                end
            end

        end
    end
end
