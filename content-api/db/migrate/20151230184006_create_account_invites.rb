class CreateAccountInvites < ActiveRecord::Migration
    def change
        create_table :account_invites do |t|
            t.integer :account_id, null: false
            t.integer :issuer_id, null: false
            t.text :invited_email, null: false
            t.text :token, null: false

            t.timestamps null: false
        end
        add_index :account_invites, :invited_email, unique: true
        add_index :account_invites, :token, unique: true
    end
end
