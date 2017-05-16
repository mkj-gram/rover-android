class CreateUsers < ActiveRecord::Migration
    def change
        create_table :users do |t|
            t.string :name
            t.string :email, null: false
            t.string :password_digest, null: false
            t.integer :account_id, null: false
            t.boolean :account_owner, default: false
            t.integer :user_role_id, null: false
            t.datetime :user_role_updated_at
            t.timestamps null: false
        end

        add_index :users, :account_id
        add_index :users, :email
    end
end
