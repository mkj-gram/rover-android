class Acl < ActiveRecord::Base

    def has_access(resource, method)
        # resource some model
        # method the method the user wants to perform ie :show, :create, :update, :destroy
        column = resource.is_a?(Class) ? resource.name.downcase : resource.class.name.downcase
        column = column.concat("_#{method}")
        access = self.read_attribute(column)
        access = false if access.nil?
        return access
    end
end
