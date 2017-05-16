class AddDeeplinkUrlToMessageTemplates < ActiveRecord::Migration
    def change
        add_column :message_templates, :deeplink_url, :string
    end
end
