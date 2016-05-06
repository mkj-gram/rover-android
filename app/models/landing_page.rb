class LandingPage < LandingPageBuilder::Screen

    def to_doc
        JSON.parse(to_json)
    end

    def to_json(opts ={})
        super
    end

    def as_json(opts = {})
        json = super
        json.dasherize! if opts[:dasherize]
        json
    end

end
