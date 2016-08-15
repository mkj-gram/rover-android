module V1::ExperienceSerializer
    class << self
        def serialize(experience, version)
            has_unpublished_changes = !experience.current_version_id.nil?
            {
                id: experience.id.to_s,
                attributes: {
                    name: experience.title,
                    'has-unpublished-changes' => has_unpublished_changes,
                    'is-published' => experience.is_published,
                    'is-archived' => experience.is_archived,
                    'short-url' => experience.short_url,
                    'home-screen-id' => version.nil? ? nil : version.home_screen_id,
                    screens: version.nil? ? [] : version.screens.as_json.map{|screen| screen.deep_transform_keys{|key| key.to_s.dasherize }}
                }
            }
        end
    end
end
