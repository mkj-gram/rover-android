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

        def ==(other)
            return false if other.nil?
            (
                self.title == other.title &&
                self.rows == other.rows &&
                self.background_color == other.background_color &&
                self.title_bar_text_color == other.title_bar_text_color &&
                self.title_bar_background_color == other.title_bar_background_color &&
                self.title_bar_button_color == other.title_bar_button_color &&
                self.status_bar_style == other.status_bar_style &&
                self.use_default_title_bar_style == other.use_default_title_bar_style
            )
        end
    end
end
