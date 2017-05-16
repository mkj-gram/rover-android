class CreateSessions < ActiveRecord::Migration
    def change
        create_table :sessions do |t|
            t.integer :account_id
            t.integer :user_id
            t.string :token
        end

        add_index :sessions, :account_id
        # add_index :sessions, :user_id
        add_index :sessions, :token

    end
end
