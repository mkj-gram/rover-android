class AddSearchableGimbalPlacesCountToAccounts < ActiveRecord::Migration
	def change
		add_column :accounts, :searchable_gimbal_places_count, :integer, default: 0
	end
end
