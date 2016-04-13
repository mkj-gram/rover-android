class AddPlatformResourceToUserRoles < ActiveRecord::Migration
    def change
        add_column :user_roles, :platform_show, :boolean, default: true
        add_column :user_roles, :platform_create, :boolean, default: true
        add_column :user_roles, :platform_update, :boolean, default: true
        add_column :user_roles, :platform_destroy, :boolean, default: true
    end
end
