class AddTimestampsToSessions < ActiveRecord::Migration

	def up
		add_column :sessions, :created_at, :datetime
    	add_column :sessions, :updated_at, :datetime
		Session.update_all(created_at: Time.zone.now, updated_at: Time.zone.now)
		change_column_null :sessions, :created_at, false
    	change_column_null :sessions, :updated_at, false
	end

	def down
		remove_column :sessions, :created_at
		remove_column :sessions, :updated_at
	end
	
end
