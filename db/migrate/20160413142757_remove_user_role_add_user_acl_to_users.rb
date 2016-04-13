class RemoveUserRoleAddUserAclToUsers < ActiveRecord::Migration

    def up
        remove_column :users, :user_role_id
        remove_column :users, :user_role_updated_at

        add_column :users, :user_acl_id, :integer
        add_column :users, :user_acl_updated_at, :timestamp

        create_acl_for_users
    end

    def down
        add_column :users, :user_role_id, :integer
        add_column :users, :user_role_updated_at, :timestamp

        remove_column :users, :user_acl_id, :integer
        remove_column :users, :user_acl_updated_at, :timestamp
    end

    private

    def create_acl_for_users
        puts "Updating User's acl"
        User.find_each do |user|
            next if !user.user_acl_id.nil?
            user_acl = UserAcl.create(user_id: user.id)
            user.user_acl_id = user_acl.id
            user.save

            user_acl.attach_role(user.account.default_user_role)
        end
        puts "Done!"
    end

end
