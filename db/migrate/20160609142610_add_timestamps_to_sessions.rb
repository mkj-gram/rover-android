class AddTimestampsToSessions < ActiveRecord::Migration
    def change
        add_timestamps(:sessions, null: false)
    end
end
