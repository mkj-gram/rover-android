module LandingPageBuilder
    class Unit
        include Virtus.model

        attribute :value, Float
        attribute :type, String, default: "points"


        def ==(other)
            return false if other.nil?
            self.value == other.value && self.type == other.type
        end

    end
end