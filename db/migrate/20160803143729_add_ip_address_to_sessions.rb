class AddIpAddressToSessions < ActiveRecord::Migration
    def change
        add_column :sessions, :ip_address, :string
    end
end
