module TemplateHelper

    TEMPLATE_ARGUMENT_REGEX = /\{[a-zA-Z\_0-9\.\,\s\-]*\}/.freeze

    class << self
        def render_string(string, opts = {})
            return string if string.nil? || string.empty?
            string.gsub(TEMPLATE_ARGUMENT_REGEX) do |string_match|
                attribute, fallback = string_match[1..string_match.length-2].split(",")
                if opts[attribute]
                    opts[attribute]
                else
                    fallback
                end
            end
        end
    end

end
