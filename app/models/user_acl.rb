class UserAcl < ActiveRecord::Base
    self.primary_key = "user_id"

    before_create :set_acl_for_admin

    belongs_to :user, touch: :acl_updated_at


    def has_access(resources, acl_path)
        return true
        # return self.attributes[acl_path] == true if resource.nil?
        # return true if resource.is_a?(User) && user.id == resource.id
        # return true if resource.is_a?(Account) && user.account_id == resource.id
        # # the resource must belong to the same account
        # same_account = false
        # if resource.respond_to?(:account_id)
        #     same_account = user.account_id == resource.account_id
        # elsif resource.respond_to?(:account)
        #     same_account =  user.account_id == resource.account.id
        # elsif resource.respond_to?(:belongs_to_account)
        #     same_account = resource.belongs_to_account(user.account_id)
        # else
        #     # the resource doesn't belong to the same account
        #     return false
        # end

        # if same_account
        #     # they belong to the same account now check the acl path
        #     return self.attributes[acl_path] == true
        # else
        #     return false
        # end
    end

    private

    def set_acl_for_admin
        if admin == true
            # admin should have access to everything
            self.users_show = true
            self.users_index = true
            self.users_create = true
            self.users_destroy = true
        end
    end
end
