module Experiences
    class Alignment
        include Virtus.model

        attribute :horizontal, String, default: "left"
        attribute :vertical, String, default: "top"


        def to_doc
            {
                horizontal: horizontal,
                vertical: vertical
            }
        end
        
    end
end
