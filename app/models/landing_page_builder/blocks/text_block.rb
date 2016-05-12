module LandingPageBuilder
    module Blocks
        class TextBlock < Block
            include Virtus.model

            attribute :text, String

            def ==(other)
                return false if other.nil?
                (
                    super &&
                    self.text == other.text
                )

            end
        end
    end
end
