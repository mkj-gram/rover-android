class CreatePasswordResets < ActiveRecord::Migration
    def change
        create_table :password_resets, { id: false } do |t|
            t.integer :user_id, null: false
            t.text :email, null: false
            t.text :token, null: false
            t.datetime :expires_at, null: false
        end

        # add_index :password_resets, :user_id, unique: true
        add_index :password_resets, :email, unique: true
        add_index :password_resets, :token, unique: true
    end
end
