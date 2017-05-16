require 'util_helper'
module UniqueTagsUpdatable
    extend ActiveSupport::Concern

    class_methods do
        def update_tags(account_id, old_tags, new_tags)
            if !(old_tags.empty? && new_tags.empty?)
                old_tags = old_tags.compact
                new_tags = new_tags.compact
                old_tags_sql = UtilHelper.string_array_to_sql_array(old_tags)
                new_tags_sql = UtilHelper.string_array_to_sql_array(new_tags)
                self.where(account_id: account_id).update_all("tags = array_distinct(array_subtraction(tags, #{old_tags_sql}) || #{new_tags_sql})")
            end
        end
    end
end
