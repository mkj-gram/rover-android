module PermissionsHelper

    def self.included(base)
        base.extend ClassMethods
    end

    def _check_permissions(allowed_permissions = [])
        if !(current_auth_ctx && current_auth_ctx.permission_scopes.any? { |scope| allowed_permissions.include?(scope) })
            logger.debug("User or Account do not have sufficient permissions needed: #{allowed_permissions} had: #{current_auth_ctx.permission_scopes}")
            render_forbidden("NOP", "E")
        end
    end

    module ClassMethods
         def allow(controller_methods, permissions = [])
            if !controller_methods.is_a?(Array)
                controller_methods = [controller_methods]
            end
            
            before_action -> { _check_permissions(permissions) }, if: lambda { |c| controller_methods == [:all] || controller_methods.include?(c.action_name) }
        end
    end

end