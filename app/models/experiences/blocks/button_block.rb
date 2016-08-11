module Experiences
    module Blocks
        class ButtonBlock < Block
            include Virtus.model
            

            def to_doc
                super.merge!({

                })
            end

        end
    end
end
