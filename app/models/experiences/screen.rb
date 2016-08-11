module Experiences
	class Screen
		include Virtus.model

		attribute :id, String
		attribute :name, String
		attribute :background_color, Color
		attribute :title_bar_text_color, Color
		attribute :title_bar_background_color, Color
		attribute :status_bar_style, String, default: 'dark'
		attribute :use_default_title_bar_style, Boolean
		attribute :rows, Array[Experiences::Row], default: []
		

		def to_doc
			{
				id: id,
				background_color: background_color.to_doc,
				title_bar_text_color: title_bar_text_color.to_doc,
				title_bar_background_color: title_bar_background_color.to_doc,
				status_bar_style: status_bar_style,
				use_default_title_bar_style: use_default_title_bar_style,
				rows: rows.map(&:to_doc)
			}
		end

		def as_json(options = {})
			data = {
				id: id,
				background_color: background_color,
				title_bar_text_color: title_bar_text_color,
				title_bar_background_color: title_bar_background_color,
				status_bar_style: status_bar_style,
				use_default_title_bar_style: use_default_title_bar_style,
				rows: rows
			}

			if options[:camel_case]
				data.transform_keys! { |key| key = key.to_s.camelize(:lower) }
			end

			return data
		end
	end
end