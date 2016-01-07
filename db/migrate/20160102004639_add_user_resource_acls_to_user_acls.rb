class AddUserResourceAclsToUserAcls < ActiveRecord::Migration
    def change
        add_column :user_acls, :users_index, :boolean, default: true
        add_column :user_acls, :users_show, :boolean, default: true
        add_column :user_acls, :users_create, :boolean, default: true
        add_column :user_acls, :users_update, :boolean, default: false
        add_column :user_acls, :users_destroy, :boolean, default: false
    end
end
