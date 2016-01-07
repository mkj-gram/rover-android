class CreateUserAcls < ActiveRecord::Migration
    def change
        create_table :user_acls, id: false do |t|
            t.integer :user_id, null: false
            t.boolean :admin, default: false
        end
        add_index :user_acls, :user_id, unique: true
    end
end
