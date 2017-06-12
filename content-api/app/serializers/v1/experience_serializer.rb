module V1::ExperienceSerializer
    class << self
        def serialize(experience, version, subdomain = "", cname = nil, opts = {})
            has_unpublished_changes = !experience.current_version_id.nil?

            simulator_url = build_simulator_url(subdomain, cname, experience.short_url)
            
            data = {
                id: experience.id.to_s,
                type: 'experiences'.freeze,
                attributes: {
                    name: experience.title,
                    :'account-id' => experience.account_id,
                    :'version-id' => version.nil? ? nil : version.id,
                    :'view-token' => experience.view_token,
                    :'has-unpublished-changes' => has_unpublished_changes,
                    :'is-published' => experience.is_published,
                    :'is-archived' => experience.is_archived,
                    :'short-url' => experience.short_url,
                    :'simulator-url' => simulator_url,
                    :'home-screen-id' => version.nil? ? nil : version.home_screen_id,
                    :'custom-keys' => version.nil? ? {} : version.custom_keys,
                    screens: version.nil? ? [] : version.screens.as_json.map{|screen| dasherize(screen , { skip: [:custom_keys] })}
                }
            }
            
            if opts[:fields] && opts[:fields].is_a?(Array) && opts[:fields].any?
                data[:attributes].slice!(*opts[:fields])
            end

            if opts[:exclude_fields] && opts[:exclude_fields].is_a?(Array) && opts[:exclude_fields].any?
                opts[:exclude_fields].each do |field|
                    data[:attributes].delete(field)
                end
            end

            return data

        end


        private

        def build_simulator_url(subdomain, cname, short_url)
            host = cname.nil? ? Rails.configuration.simulator["host"] : cname
            if subdomain.nil? || subdomain.empty?
                "https://#{host}/#{short_url}"
            else
                "https://#{subdomain}.#{host}/#{short_url}"
            end
        end

        def dasherize(input, opts = {})
            
            if !(input.is_a?(Hash) || input.is_a?(Array))
                return input
            end

            input.inject({}) do |new_hash, (k,v)|
                if opts[:skip] && opts[:skip].any? {|skipfield| skipfield == k.to_sym }
                    new_hash[k.dasherize] = v
                elsif v.is_a?(Hash)
                    new_hash[k.dasherize] = dasherize(v, opts)
                elsif v.is_a?(Array)
                    new_hash[k.dasherize] = v.map{|obj| dasherize(obj, opts)}
                else
                    new_hash[k.dasherize] = v
                end

                new_hash
            end
        end

    end
end
