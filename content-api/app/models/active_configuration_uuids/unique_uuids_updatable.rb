require 'util_helper'
module UniqueUuidsUpdatable
    extend ActiveSupport::Concern

    class_methods do
        def update_uuids(account_id, old_uuids, new_uuids)
            if !(old_uuids.empty? && new_uuids.empty?)
                old_uuids = old_uuids.compact.map(&:upcase)
                new_uuids = new_uuids.compact.map(&:upcase)
                old_uuids_sql = UtilHelper.string_array_to_sql_array(old_uuids)
                new_uuids_sql = UtilHelper.string_array_to_sql_array(new_uuids)
                self.where(account_id: account_id).update_all("configuration_uuids = array_distinct(array_subtraction(configuration_uuids, #{old_uuids_sql}) || #{new_uuids_sql})")
            end
        end
    end
end
