class ChangeMessagesToMessageTemplatesInUserRolesAndUserAcls < ActiveRecord::Migration
    def change

        rename_column :user_roles, :proximity_message_show,     :proximity_message_template_show
        rename_column :user_roles, :proximity_message_create,   :proximity_message_template_create
        rename_column :user_roles, :proximity_message_update,   :proximity_message_template_update
        rename_column :user_roles, :proximity_message_destroy,  :proximity_message_template_destroy

        rename_column :user_acls, :proximity_message_show,      :proximity_message_template_show
        rename_column :user_acls, :proximity_message_create,    :proximity_message_template_create
        rename_column :user_acls, :proximity_message_update,    :proximity_message_template_update
        rename_column :user_acls, :proximity_message_destroy,   :proximity_message_template_destroy

        rename_column :user_roles, :scheduled_message_show,     :scheduled_message_template_show
        rename_column :user_roles, :scheduled_message_create,   :scheduled_message_template_create
        rename_column :user_roles, :scheduled_message_update,   :scheduled_message_template_update
        rename_column :user_roles, :scheduled_message_destroy,  :scheduled_message_template_destroy

        rename_column :user_acls, :scheduled_message_show,      :scheduled_message_template_show
        rename_column :user_acls, :scheduled_message_create,    :scheduled_message_template_create
        rename_column :user_acls, :scheduled_message_update,    :scheduled_message_template_update
        rename_column :user_acls, :scheduled_message_destroy,   :scheduled_message_template_destroy


        rename_column :user_roles, :automated_message_show,     :automated_message_template_show
        rename_column :user_roles, :automated_message_create,   :automated_message_template_create
        rename_column :user_roles, :automated_message_update,   :automated_message_template_update
        rename_column :user_roles, :automated_message_destroy,  :automated_message_template_destroy

        rename_column :user_acls, :automated_message_show,      :automated_message_template_show
        rename_column :user_acls, :automated_message_create,    :automated_message_template_create
        rename_column :user_acls, :automated_message_update,    :automated_message_template_update
        rename_column :user_acls, :automated_message_destroy,   :automated_message_template_destroy

    end
end
