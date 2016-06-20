class AddSentStatusToMessageTemplates < ActiveRecord::Migration
    def change
        add_column :message_templates, :sent, :boolean, default: false
    end
end
