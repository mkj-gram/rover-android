module V1::ExperienceSerializer
    class << self
        def serialize(experience, version)
            has_unpublished_changes = !experience.current_version_id.nil?
            {
                type: 'experiences',
                id: experience.id,
                attributes: {
                    title: experience.title,
                    :'has-unpublished-changes' => has_unpublished_changes,
                    published: experience.published,
                    archived: experience.archived,
                    :'short-url' => experience.short_url,
                    screens: version.screens.map{|screen| screen.merge("experience-id" => experience.id)}
                }
            }
        end
    end
end
