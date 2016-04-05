class CreateUserRoles < ActiveRecord::Migration
    def change
        create_table :user_roles do |t|
            t.integer :account_id, null: false
            t.string :title
            t.text :description

            t.boolean :user_show,    default: true
            t.boolean :user_create,  default: true
            t.boolean :user_update,  default: true
            t.boolean :user_destroy, default: true

            t.boolean :beacon_configuration_show,    default: true
            t.boolean :beacon_configuration_create,  default: true
            t.boolean :beacon_configuration_update,  default: true
            t.boolean :beacon_configuration_destroy, default: true

            t.boolean :location_show,    default: true
            t.boolean :location_create,  default: true
            t.boolean :location_update,  default: true
            t.boolean :location_destroy, default: true

            t.boolean :customer_show,    default: true
            t.boolean :customer_create,  default: true
            t.boolean :customer_update,  default: true
            t.boolean :customer_destroy, default: true

            t.boolean :customer_segment_show,    default: true
            t.boolean :customer_segment_create,  default: true
            t.boolean :customer_segment_update,  default: true
            t.boolean :customer_segment_destroy, default: true

            t.boolean :proximity_message_show,    default: true
            t.boolean :proximity_message_create,  default: true
            t.boolean :proximity_message_update,  default: true
            t.boolean :proximity_message_destroy, default: true

            t.boolean :scheduled_message_show,    default: true
            t.boolean :scheduled_message_create,  default: true
            t.boolean :scheduled_message_update,  default: true
            t.boolean :scheduled_message_destroy, default: true

            t.boolean :automated_message_show,    default: true
            t.boolean :automated_message_create,  default: true
            t.boolean :automated_message_update,  default: true
            t.boolean :automated_message_destroy, default: true

            t.boolean :user_acl_show,    default: true
            t.boolean :user_acl_create,  default: true
            t.boolean :user_acl_update,  default: true
            t.boolean :user_acl_destroy, default: true

            t.integer :users_count, default: 0

        end

        add_index :user_roles, :account_id
    end
end
