module Experiences
	class Row
		include Virtus.model

		attribute :id, String
		attribute :screen_id, String
		attribute :experience_id, String
		attribute :name, String
		attribute :auto_height, Boolean
		attribute :height, Unit
		attribute :background_color, Color
		attribute :blocks, Array[Experiences::Block], default: []


		def initialize(args = {})
			blocks = args.delete("blocks") || args.delete(:blocks) || []
			blocks = blocks.map{|block| Experiences::Block.build(block) }
			args.merge!(blocks: blocks)
			super args
		end


		def to_doc
			{
				id: id,
				screen_id: screen_id,
				experience_id: experience_id,
				name: name,
				auto_height: auto_height,
				height: height.to_doc,
				background_color: background_color.to_doc,
				blocks: blocks.map(&:to_doc)
			}
		end
	end
end