class UserRole < ActiveRecord::Base

    has_many :users

    after_save :update_users

    def self.admin_role
        UserRole.new(
            title: "Admin",
            description: "Admin Access",
            user_show: true,
            user_create: true,
            user_update: true,
            user_destroy: true,

            beacon_configuration_show: true,
            beacon_configuration_create: true,
            beacon_configuration_update: true,
            beacon_configuration_destroy: true,

            location_show: true,
            location_create: true,
            location_update: true,
            location_destroy: true,

            customer_show: true,
            customer_create: true,
            customer_update: true,
            customer_destroy: true,

            customer_segment_show: true,
            customer_segment_create: true,
            customer_segment_update: true,
            customer_segment_destroy: true,

            proximity_message_show: true,
            proximity_message_create: true,
            proximity_message_update: true,
            proximity_message_destroy: true,

            scheduled_message_show: true,
            scheduled_message_create: true,
            scheduled_message_update: true,
            scheduled_message_destroy: true,

            automated_message_show: true,
            automated_message_create: true,
            automated_message_update: true,
            automated_message_destroy: true,

            user_acl_show: true,
            user_acl_create: true,
            user_acl_update: true,
            user_acl_destroy: true,
        )
    end

    def has_access(resource, method)
        Rails.logger.info("has_access to #{resource} with method #{method}")
        # resource some model
        # method the method the user wants to perform ie :show, :create, :update, :destroy
        column = resource.is_a?(Class) ? resource.name.underscore : resource.class.name.underscore
        column = column.concat("_#{method}")
        Rails.logger.info("column to read #{column}")
        access = self.read_attribute(column)
        access = false if access.nil?
        Rails.logger.info("Access? #{access}")
        return access
    end

    private

    def update_users
        users.update_all(user_role_updated_at: Time.now)
    end
end
