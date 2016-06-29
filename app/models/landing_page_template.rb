class LandingPageTemplate < LandingPageBuilder::Screen

    # class << self

    #     def load(obj)
    #         return obj if !obj.is_a?(Hash)
    #         begin
    #             landing_page = LandingPageTemplate.new(obj)
    #             landing_page.valid = true
    #             return landing_page
    #         rescue => e
    #             Rails.logger.warn("Couldn't load object #{obj} into LandingPageTemplate")
    #             invalid = LandingPageTemplate.new()
    #             invalid.valid = false
    #             return invalid
    #         end
    #     end

    #     def dump(obj)
    #         if obj.is_a?(LandingPageTemplate)
    #             obj.to_json
    #         else
    #             obj
    #         end
    #     end

    # end

    class Type < ActiveRecord::Type::Value
        def type
            :jsonb
        end

        def type_cast_from_user(value)
            # when programmer sets the value
            load_landing_page_from_json(value)
        end

        def type_cast_from_database(value)
            if String === value
                json = ::ActiveSupport::JSON.decode(value) rescue nil
                load_landing_page_from_json(json)
            else
                super value
            end
        end

        def type_cast_for_database(value)
            if value.is_a?(LandingPageTemplate)
                value.to_json
            else
                super value
            end
        end


        def load_landing_page_from_json(json)
            begin
                landing_page = LandingPageTemplate.new(json)
                landing_page.valid = true
                return landing_page
            rescue => e
                Rails.logger.warn("Couldn't load object #{json} into LandingPageTemplate")
                invalid = LandingPageTemplate.new()
                invalid.valid = false
                return invalid
            end
        end

        def changed_in_place?(raw_old_value, new_value)
            type_cast_from_database(raw_old_value) != new_value
        end

    end

    def valid=(new_value)
        @valid = new_value
    end

    def valid?
        !!@valid
    end

    def render(opts = {})
        LandingPage.new(
            {
                title: TemplateHelper.render_string(title, opts),
                background_color: background_color,
                rows:  rows.map do |row|
                    {
                        blocks: row.blocks.map do |block|
                            case block
                            when LandingPageBuilder::Blocks::TextBlock
                                block.text = TemplateHelper.render_string(block.text, opts) if block.text
                            when LandingPageBuilder::Blocks::ButtonBlock
                                if block.states
                                    block.states.each do |state|
                                        state.text = TemplateHelper.render_string(state.text, opts)
                                    end
                                end
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
