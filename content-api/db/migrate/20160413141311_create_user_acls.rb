class CreateUserAcls < ActiveRecord::Migration
    def change
        create_table :user_acls do |t|
            t.integer :user_id, null: false
            t.integer :user_role_ids, array: true, default: []

            t.boolean :account_show,    default: true
            t.boolean :account_create,  default: true
            t.boolean :account_update,  default: true
            t.boolean :account_destroy, default: true

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

            t.boolean :third_party_integration_show,    default: true
            t.boolean :third_party_integration_create,  default: true
            t.boolean :third_party_integration_update,  default: true
            t.boolean :third_party_integration_destroy, default: true

            t.boolean :account_invite_show,    default: true
            t.boolean :account_invite_create,  default: true
            t.boolean :account_invite_update,  default: true
            t.boolean :account_invite_destroy, default: true

            t.boolean :user_acl_show,    default: true
            t.boolean :user_acl_create,  default: true
            t.boolean :user_acl_update,  default: true
            t.boolean :user_acl_destroy, default: true

            t.timestamps null: false
        end

        add_index :user_acls, :user_id
    end
end
