class AddCnameToAccounts < ActiveRecord::Migration

    def change
        add_column :accounts, :cname, :string
    end

end
