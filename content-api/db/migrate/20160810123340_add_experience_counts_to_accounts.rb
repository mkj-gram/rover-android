class AddExperienceCountsToAccounts < ActiveRecord::Migration
    def change
        add_column :accounts, :experiences_draft_count, :integer, default: 0
        add_column :accounts, :experiences_published_count, :integer, default: 0
        add_column :accounts, :experiences_archived_count, :integer, default: 0
    end
end
