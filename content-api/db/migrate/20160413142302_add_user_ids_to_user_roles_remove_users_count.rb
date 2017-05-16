class AddUserIdsToUserRolesRemoveUsersCount < ActiveRecord::Migration
    def change
        add_column :user_roles, :user_ids, :integer, array: true, default: []
        remove_column :user_roles, :users_count
    end
end
