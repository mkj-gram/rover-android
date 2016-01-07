class CreateUsers < ActiveRecord::Migration
    def change
        create_table :users do |t|
            t.string :name
            t.string :email, null: false
            t.string :password_digest, null: false
            t.integer :account_id, null: false
            t.boolean :account_owner, default: false
            t.datetime :acl_updated_at
            t.timestamps null: false
        end

        add_index :users, :account_id
        add_index :users, :email
    end
end
