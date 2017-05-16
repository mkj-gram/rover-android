module LandingPageBuilder
    module Blocks
        class ButtonBlock < Block
            include Virtus.model


            attribute :states, LandingPageBuilder::ButtonStates::Hash, default: {}

            attribute :action, LandingPageBuilder::Actions::Action

            def ==(other)
                return false if other.nil?
                (
                    super &&
                    self.states == other.states &&
                    self.action == other.action
                )
            end

            def action=(new_action)
                return if new_action.nil?
                super LandingPageBuilder::Actions::ActionBuilder.new(new_action)
            end

        end
    end
end
