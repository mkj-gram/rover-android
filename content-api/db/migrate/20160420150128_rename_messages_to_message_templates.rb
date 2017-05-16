class RenameMessagesToMessageTemplates < ActiveRecord::Migration
    def change
        rename_table :messages, :message_templates
    end
end
