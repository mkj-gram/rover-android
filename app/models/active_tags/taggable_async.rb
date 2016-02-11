module TaggableAsync
    extend ActiveSupport::Concern

    class_methods do
        def update_tags(account_id, old_tags, new_tags)
            if !(old_tags.empty? && new_tags.empty?)
                # account_id, tag_type, lookup_klass, old_tags, new_tags
                UpdateActiveTagsWorker.perform_async(account_id, self.name, lookup_class, old_tags, new_tags)
            end
        end
    end
end
