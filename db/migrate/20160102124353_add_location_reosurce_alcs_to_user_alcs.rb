class AddLocationReosurceAlcsToUserAlcs < ActiveRecord::Migration
    def change
        add_column :user_acls, :locations_index, :boolean, default: true
        add_column :user_acls, :locations_show, :boolean, default: true
        add_column :user_acls, :locations_create, :boolean, default: true
        add_column :user_acls, :locations_update, :boolean, default: true
        add_column :user_acls, :locations_destroy, :boolean, default: false
    end
end
