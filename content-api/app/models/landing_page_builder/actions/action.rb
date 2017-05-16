module LandingPageBuilder
    module Actions
        class Action
            include Virtus.model

            attribute :type, String

            def ==(other)
                return false if other.nil?
                (
                    self.type == other.type
                )
            end

        end
    end
end
