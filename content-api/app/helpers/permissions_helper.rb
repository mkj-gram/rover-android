module PermissionsHelper

    def self.included(base)
        base.extend ClassMethods
    end

    def _check_permissions(allowed_permissions = [])
        if !(current_auth_ctx && current_auth_ctx.permission_scopes.any? { |scope| allowed_permissions.include?(scope.to_sym) })
            logger.warn("User or Account does not have sufficient permissions needed: #{allowed_permissions} had: #{current_auth_ctx.permission_scopes}")
            render_forbidden("Forbidden", "You do not have sufficent permissions")
        end
    end

    module ClassMethods
         def allow(*args)
            # https://apidock.com/rails/ActiveSupport/CoreExtensions/Array/ExtractOptions/extract_options%21
            options = args.extract_options!
            # https://github.com/rails/rails/blob/d7be30e8babf5e37a891522869e7b0191b79b757/actionpack/lib/abstract_controller/callbacks.rb#L44
            _normalize_callback_options(options)
            permissions = args
            before_action -> { _check_permissions(permissions) }, options
        end
    end

end