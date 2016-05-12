module LandingPageBuilder
    class Screen
        include Virtus.model

        attribute :title, String
        attribute :rows, Array[LandingPageBuilder::Row]


        def ==(other)
            return false if other.nil?
            (
                self.title == other.title &&
                self.rows == other.rows
            )
        end
    end
end
