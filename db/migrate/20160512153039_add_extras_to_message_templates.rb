class AddExtrasToMessageTemplates < ActiveRecord::Migration
    def change
        add_column :message_templates, :extras, :jsonb
    end
end
