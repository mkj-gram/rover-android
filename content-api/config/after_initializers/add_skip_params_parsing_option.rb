module AddSkipParamsParsingOption
    def self.prepended(mod)
        mod.class_eval do
            cattr_accessor :skipped_paths do
                {}
            end

            def self.add_to_skipped_paths(paths)
                paths.each {|k,v| paths[k] = v.map!{|m| Regexp.new(m) } }
                self.skipped_paths.merge!(paths)
            end

        end
    end


    private

    def parse_formatted_parameters(env)
       
        request = ActionDispatch::Request.new(env)

        if skipped_paths.include?(request.request_method_symbol.upcase) && skipped_paths[request.request_method_symbol.upcase].any? {|path_matcher| (path_matcher =~ request.path) == 0}
            ::Rails.logger.info "Skipping params parsing for path #{ request.path }"
            return nil
        else
            super(env)
        end

    end
end

# :prepend is injecting this module inside ActionDispatch::ParamsParser
ActionDispatch::ParamsParser.send :prepend, AddSkipParamsParsingOption
