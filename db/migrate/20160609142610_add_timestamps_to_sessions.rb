class AddTimestampsToSessions < ActiveRecord::Migration
    def change
    	add_column :sessions, :created_at, :datetime
    	add_column :sessions, :updated_at, :datetime
    	change_column_null :sessions, :created_at, false
    	change_column_null :sessions, :updated_at, false
    end
end
