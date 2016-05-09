class LandingPageTemplate < LandingPageBuilder::Screen

    class << self

        def load(obj)
            return nil if obj.nil?
            return obj if !obj.is_a?(Hash)
            begin
                LandingPageTemplate.new(obj)
            rescue => e
                Rails.logger.warn("Couldn't load object #{obj} into LandingPageTemplate")
                return nil
            end
        end

        def dump(obj)
            if obj.is_a?(LandingPageTemplate)
                obj.to_json
            else
                obj
            end
        end

    end

    def valid?
        true
    end

    def render(opts = {})
        LandingPage.new(
            {
                title: TemplateHelper.render_string(title, opts),
                rows:  rows.map do |row|
                    {
                        blocks: row.blocks.map do |block|
                            case block
                            when LandingPageBuilder::Blocks::TextBlock
                                block.text = TemplateHelper.render_string(block.text, opts) if block.text
                            when LandingPageBuilder::Blocks::ButtonBlock
                                block.title = TemplateHelper.render_string(block.title, opts) if block.title
                            end
                            block.as_json
                        end
                    }

                end
            }
        )
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
