class AddAppIdPrefixAndAppStoreIdToIosPlatforms < ActiveRecord::Migration
    
    def change
        add_column :ios_platforms, :app_id_prefix, :string
        add_column :ios_platforms, :app_store_id, :string
    end

end
