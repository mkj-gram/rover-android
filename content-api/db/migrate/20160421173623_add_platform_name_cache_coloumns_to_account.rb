class AddPlatformNameCacheColoumnsToAccount < ActiveRecord::Migration
    def change
        add_column :accounts, :ios_platform_name, :string
        add_column :accounts, :android_platform_name, :string
    end
end
