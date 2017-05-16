class ChangeActionToContentInMessageTemplates < ActiveRecord::Migration
    def change
        rename_column :message_templates, :action, :content_type
        rename_column :message_templates, :action_url, :website_url
    end
end
