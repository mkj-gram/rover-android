class UserRole < ActiveRecord::Base

    def self.admin_role
        UserRole.new(
            title: "Admin",
            description: "Admin Access",

            account_show: true,
            account_create: true,
            account_update: true,
            account_destroy: true,

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

            third_party_integration_show: true,
            third_party_integration_create: true,
            third_party_integration_update: true,
            third_party_integration_destroy: true,

            account_invite_show: true,
            account_invite_create: true,
            account_invite_update: true,
            account_invite_destroy: true,


            user_acl_show: true,
            user_acl_create: true,
            user_acl_update: true,
            user_acl_destroy: true,

            platform_show: true,
            platform_create: true,
            platform_update: true,
            platform_destroy: true
        )
    end

    def attach_user(user)
        self.user_ids.push(user.id)
        self.user_ids.uniq!
        self.save
    end

    def users
        @users ||= User.where(id: self.user_ids).all
    end

end
