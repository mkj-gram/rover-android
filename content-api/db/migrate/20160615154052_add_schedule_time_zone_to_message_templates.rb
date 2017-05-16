class AddScheduleTimeZoneToMessageTemplates < ActiveRecord::Migration
    def change
        add_column :message_templates, :scheduled_time_zone, :string
    end
end
