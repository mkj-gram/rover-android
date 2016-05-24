class AddPropertiesToMessageTemplates < ActiveRecord::Migration
    def change
        add_column :message_templates, :properties, :jsonb
    end
end
