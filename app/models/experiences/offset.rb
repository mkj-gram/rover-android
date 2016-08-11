module Experiences
	class Offset
		include Virtus.model
		
		attribute :top, Unit, default: { value: 0, type: "points" }
        attribute :right, Unit, default: { value: 0, type: "points" }
        attribute :bottom, Unit, default: { value: 0, type: "points" }
        attribute :left, Unit, default: { value: 0, type: "points" }
        attribute :center, Unit, default: { value: 0, type: "points" }
        attribute :middle, Unit, default: { value: 0, type: "points" }

        def to_doc
            {
                top: top.to_doc,
                right: right.to_doc,
                bottom: bottom.to_doc,
                left: left.to_doc,
                center: center.to_doc,
                middle: middle.to_doc
            }
        end
	end
end