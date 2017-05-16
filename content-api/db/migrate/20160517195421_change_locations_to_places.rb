class ChangeLocationsToPlaces < ActiveRecord::Migration
    def change
        # accounts
        rename_column :accounts, :locations_count, :places_count
        rename_column :accounts, :searchable_locations_count, :searchable_places_count

        # beacon_configurations
        rename_column :beacon_configurations, :location_id, :place_id

        rename_table :locations, :places


        # message_templates
        rename_column :message_templates, :filter_location_tags, :filter_place_tags
        rename_column :message_templates, :filter_location_ids, :filter_place_ids

        # user_acls
        rename_column :user_acls, :location_show, :place_show
        rename_column :user_acls, :location_create, :place_create
        rename_column :user_acls, :location_update, :place_update
        rename_column :user_acls, :location_destroy, :place_destroy

        # user_roles
        rename_column :user_roles, :location_show, :place_show
        rename_column :user_roles, :location_create, :place_create
        rename_column :user_roles, :location_update, :place_update
        rename_column :user_roles, :location_destroy, :place_destroy
    end
end
