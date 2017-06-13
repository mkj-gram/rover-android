module V1::ExperienceListItemSerializer
    class << self

        def serialize(experience, simulator_url)
            
            has_unpublished_changes = !experience.current_version_id.nil?

            data = {
                id: experience.id.to_s,
                type: 'experience-list-items'.freeze,
                attributes: {
                    name: experience.title,
                    :'view-token' => experience.view_token,
                    :'has-unpublished-changes' => has_unpublished_changes,
                    :'is-published' => experience.is_published,
                    :'is-archived' => experience.is_archived,
                    :'short-url' => experience.short_url,
                    :'simulator-url' => simulator_url
                }
            }

            return data

        end

    end
end
