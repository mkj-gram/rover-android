module LandingPageBuilder
    module Concerns
        module HasBackground
            extend ActiveSupport::Concern

            included do
                attribute :background_color, LandingPageBuilder::Color, default: { red: 238, green: 238, blue: 238 }
                attribute :background_image_path, String
                attribute :background_content_mode, String, default: 'tile'


                def background_equal?(other)
                    (
                        background_color == other.background_color &&
                        background_image_path == other.background_image_path &&
                        background_content_mode == other.background_content_mode
                    )
                end
            end
        end
    end
end
