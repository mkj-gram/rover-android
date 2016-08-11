module Experiences
    module Blocks
        class TextBlock < Block
            include Virtus.model
            
            def to_doc
                super.merge!({

                })
            end

        end
    end
end
