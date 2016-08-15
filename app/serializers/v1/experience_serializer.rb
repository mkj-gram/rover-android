module V1::ExperienceSerializer
    class << self
        def serialize(experience, version, opts = {})
            has_unpublished_changes = !experience.current_version_id.nil?
            data = {
                id: experience.id.to_s,
                type: 'experiences'.freeze,
                attributes: {
                    name: experience.title,
                    :'has-unpublished-changes' => has_unpublished_changes,
                    :'is-published' => experience.is_published,
                    :'is-archived' => experience.is_archived,
                    :'short-url' => experience.short_url,
                    :'home-screen-id' => version.nil? ? nil : version.home_screen_id,
                    screens: version.nil? ? [] : version.screens.as_json.map{|screen| screen.deep_transform_keys{|key| key.to_s.dasherize }}
                }
            }
            
            if opts[:fields] && opts[:fields].is_a?(Array) && opts[:fields].any?
                data[:attributes].slice!(*opts[:fields])
            end

            return data

        end
    end
end
