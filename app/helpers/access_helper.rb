#
# Provides methods to help with resource access depending on the current context
#
# @author [chrisrecalis]
#
module AccessHelper
    def set_current_resources(*resources)
        @resources = resources
    end

    def current_resource
        return @resources.first
    end

    def current_resources
        return @resources
    end

    def check_access
        # this needs some nice error reporting!
        if current_user
            acl = current_user.acl
            acl.user = current_user
            if !acl.has_access(@resources, acl_path)
                render_unauthorized("You do not have permission to access this resource")
            end
        end
    end

end
