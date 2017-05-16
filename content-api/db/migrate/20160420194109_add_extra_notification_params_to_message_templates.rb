class AddExtraNotificationParamsToMessageTemplates < ActiveRecord::Migration
    def change
        add_column :message_templates, :ios_title, :string
        add_column :message_templates, :android_title, :string
        add_column :message_templates, :android_collapse_key, :string
        add_column :message_templates, :ios_sound_file, :string
        add_column :message_templates, :android_sound_file, :string
        add_column :message_templates, :time_to_live, :integer
    end
end
