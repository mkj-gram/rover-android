class AddExperienceIdToMessageTemplates < ActiveRecord::Migration
    def change
        add_column :message_templates, :experience_id, :string
    end
end
