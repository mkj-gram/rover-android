module Events
    module ExperienceEvents
        class ExperienceEvent < Event


            def self.event_id
                Event::EXPERIENCE_EVENT_ID
            end

            def initialize(event_attributes, extra)
                super event_attributes, extra
                @experience_id = event_attributes["experience_id"]
            end

            def attributes
                parent_attributes = super
                if experience
                    parent_attributes.merge!({
                        experience: {
                            id: experience.id,
                            version_id: experience.live_version_id
                        }
                    })
                end
                return parent_attributes
            end

            private


            def experience
                return nil if @experience_id.nil?
                @experience ||= Experiences::Experience.find(@experience_id)
            end

        end
    end
end
