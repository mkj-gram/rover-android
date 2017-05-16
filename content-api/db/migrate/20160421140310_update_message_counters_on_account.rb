class UpdateMessageCountersOnAccount < ActiveRecord::Migration
    def change
        add_column :accounts, :proximity_message_templates_draft_count, :integer, default: 0
        add_column :accounts, :proximity_message_templates_published_count, :integer, default: 0
        add_column :accounts, :proximity_message_templates_archived_count, :integer, default: 0

        remove_column :accounts, :proximity_messages_count
        remove_column :accounts, :archived_proximity_messages_count
    end
end
