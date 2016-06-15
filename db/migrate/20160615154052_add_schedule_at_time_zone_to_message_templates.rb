class AddScheduleAtTimeZoneToMessageTemplates < ActiveRecord::Migration
    def change
        add_column :message_templates, :scheduled_at_time_zone, :string
    end
end
