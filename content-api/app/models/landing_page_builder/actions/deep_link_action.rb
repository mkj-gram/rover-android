module LandingPageBuilder
    module Actions
        class DeepLinkAction < Action
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
