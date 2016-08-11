module V1::ExperienceSerializer
    class << self
        def serialize(experience, version)
            has_unpublished_changes = !experience.current_version_id.nil?
            {
                id: experience.id.to_s,
                name: experience.title,
                hasUnpublishedChanges: has_unpublished_changes,
                isPublished: experience.is_published,
                isArchived: experience.is_archived,
                shortUrl: experience.short_url,
                screens: version.screens.as_json.map{|screen| screen.deep_transform_keys{|key| key.to_s.camelize(:lower)}}
            }
        end
    end
end
