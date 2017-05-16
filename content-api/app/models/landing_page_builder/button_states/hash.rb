module LandingPageBuilder
    module ButtonStates
        class Hash
            include Virtus.model

            attribute :normal, LandingPageBuilder::ButtonStates::State, default: {}
            attribute :highlighted, LandingPageBuilder::ButtonStates::State, default: {}
            attribute :disabled, LandingPageBuilder::ButtonStates::State, default: {}
            attribute :selected, LandingPageBuilder::ButtonStates::State, default: {}

            def ==(other)
                (
                    normal == other.normal &&
                    highlighted == other.highlighted &&
                    disabled == other.disabled &&
                    selected == other.selected
                )
            end

            def each(&block)
                [normal, highlighted, disabled, selected].each do |state|
                    yield state
                end
            end

        end
    end
end
