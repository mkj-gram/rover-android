class UserAcl < ActiveRecord::Base

    belongs_to :user, touch: :user_acl_updated_at
    # belongs_to_many :user_roles
    def attach_role(user_role)
        self.user_role_ids.push(user_role.id)
        self.user_role_ids.uniq!
        self.merge_roles
        self.save
        user_role.attach_user(self.user)
    end

    def has_access(resource, method)
        log("Checking if user #{self.user_id} has access to #{resource}")
        # resource some model
        # method the method the user wants to perform ie :show, :create, :update, :destroy
        column = resource.is_a?(Class) ? resource.name.underscore : resource.class.name.underscore
        column = column.concat("_#{method}")
        access = self.read_attribute(column)
        access = false if access.nil?
        if access
            log("User #{self.user_id} has access".green)
        else
            log("User #{self.user_id} " + "does not have access".red)
        end
        return access
    end

    def user_roles
        @user_roles ||= UserRole.where(id: self.user_role_ids).all
    end



    def merge_roles
        acl_attributes = self.attributes.dup
        ["user_id", "id", "user_role_ids", "created_at", "updated_at"].each do |attribute_name|
            acl_attributes.delete(attribute_name)
        end
        acl_attributes.each do |attribute_name, value|
            self[attribute_name] = user_roles.any?{|role| role[attribute_name] == true }
        end
    end


    private

    def log(message)
        Rails.logger.info(" [ACL Access] ".red.bold + message)
    end

end
