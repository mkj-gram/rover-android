class BeaconConfigurationActiveTagsIndex < ActiveRecord::Base

    before_update :unique_tags, if: -> { self.tags_changed? }

    private

    def unique_tags
        self.tags.uniq!
    end
end
