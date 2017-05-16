class AddScheduledMessageTemplatesCounterCacheToAccounts < ActiveRecord::Migration
    def change
        add_column :accounts, :scheduled_message_templates_draft_count, :integer, default: 0
        add_column :accounts, :scheduled_message_templates_published_count, :integer, default: 0
        add_column :accounts, :scheduled_message_templates_sent_count, :integer, default: 0
        add_column :accounts, :scheduled_message_templates_archived_count, :integer, default: 0
    end
end
