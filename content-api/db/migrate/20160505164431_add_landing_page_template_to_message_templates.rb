class AddLandingPageTemplateToMessageTemplates < ActiveRecord::Migration
    def change
        add_column :message_templates, :landing_page_template, :jsonb
    end
end
