class LandingPageTemplate
    include Virtus.model

    class << self

        def load(obj)
            return nil if obj.nil?
            return obj if !obj.is_a?(Hash)
            LandingPageTemplate.new(obj)
        end

        def dump(obj)
            if obj.is_a?(LandingPageTemplate)
                obj.to_json
            else
                obj
            end
        end

    end


    attribute :title, String
    attribute :rows, Array[LandingPageTemplateBuilder::Row]

    def valid?
        true
    end

    def render(opts = {})
        LandingPage.new(JSON.parse(self.to_json))
    end

end
