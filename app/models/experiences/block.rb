module Experiences
	class Block
		include Virtus.model

		attribute :id, String
		attribute :row_id, String
		attribute :screen_id, String
		attribute :experience_id, String
		attribute :name, String
		attribute :type, String, default: 'block'
		attribute :width, Unit
		attribute :height, Unit
		attribute :auto_height, Boolean
		attribute :position, String
		attribute :alignment, Alignment
		attribute :inset, Inset
		
		TEXT_BLOCK_TYPE = 'text-block'.freeze
		BUTTON_BLOCK_TYPE = 'button-block'.freeze
		IMAGE_BLOCK_TYPE = 'image-block'.freeze
		DEFAULT_BLOCK_TYPE = 'default-block'.freeze
		
		class << self
			def build(args)
				case args[:type]
				when TEXT_BLOCK_TYPE
					return Experiences::Blocks::TextBlock.new(args)
				when BUTTON_BLOCK_TYPE
					return Experiences::Blocks::ButtonBlock.new(args)
				when IMAGE_BLOCK_TYPE
					return Experiences::Blocks::ImageBlock.new(args)
				else
					return Experiences::Blocks::Block.new(args)
				end
			end
		end



		def to_doc
			{
				id: id,
				type: type
			}
		end



	end
end