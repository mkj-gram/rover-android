module LandingPageBuilder
    class Screen
        include Virtus.model

        attribute :title, String
        attribute :rows, Array[LandingPageBuilder::Row]
        attribute :background_color, LandingPageBuilder::Color, default: { red: 255 , green: 255, blue: 255 }
        attribute :title_bar_text_color, LandingPageBuilder::Color, default: { red: 0, green: 0, blue: 0 }
        attribute :title_bar_background_color, LandingPageBuilder::Color, default: { red: 255, green: 255, blue: 255 }
        attribute :title_bar_button_color, LandingPageBuilder::Color, default: { red: 0, green: 122, blue: 255 }
        attribute :status_bar_style, String, default: "dark"
        attribute :use_default_title_bar_style, Boolean, default: false
        attribute :status_bar_color, LandingPageBuilder::Color, default: lambda { |model, attribute|
            if (model.title_bar_background_color)
                color = model.title_bar_background_color
                h, s, l = ::ColorConverter.rgbToHsl(color.red, color.green, color.blue)
                l = [l - 0.1, 0].max
                r, g, b = ::ColorConverter.hslToRgb(h, s, l)
                return { red: r, green: g, blue: b, alpha: 1 }
            end 
        }

        def ==(other)
            return false if other.nil?
            return (
                self.title == other.title &&
                compare_rows(other.rows) &&
                self.rows == other.rows &&
                self.background_color == other.background_color &&
                self.title_bar_text_color == other.title_bar_text_color &&
                self.title_bar_background_color == other.title_bar_background_color &&
                self.title_bar_button_color == other.title_bar_button_color &&
                self.status_bar_style == other.status_bar_style &&
                self.use_default_title_bar_style == other.use_default_title_bar_style &&
                self.status_bar_color == other.status_bar_color
            )
        end


        private

        def compare_rows(other_rows)
            for i in 0..self.rows.length
                return false if self.rows[i] != other_rows[i]
            end

            return true
        end

    end
end
