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
        LandingPage.new(title: TemplateHelper.render_string(title, opts), rows: rows.map{|row| row.render(opts)})
    end

    def to_json(opts ={})
        super
    end

    def as_json(opts = {})
        json = super
        json.dasherize! if opts[:dasherize]
        json
    end

    def ==(other)
        return false if other.nil? || !other.is_a?(LandingPageTemplate)
        self.title == other.title && self.rows == other.rows
    end

end
