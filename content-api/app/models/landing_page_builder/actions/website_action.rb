module LandingPageBuilder
    module Actions
        class WebsiteAction < Action
            include Virtus.model

            attribute :url, String

            def ==(other)
                return false if other.nil?
                (
                    self.url == other.url
                )
            end

        end
    end
end
