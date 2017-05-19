class V1::ApplicationController < ActionController::API
    include Rails.application.routes.url_helpers
    include PageHelper
    include OrderHelper
    include IncludeHelper
    include JsonHelper
    include RenderHelper


    before_action :set_locale
    before_action :set_raven_context

    attr_reader :current_user, :current_account

    APPLICATION_API_KEY_HEADER = "X-Rover-Api-Key".freeze
    APPLICATION_DEVICE_ID_HEADER = "X-Rover-Device-Id".freeze
    EXPERIENCE_APP_USER_AGENT = /Experiences\/\d+/


    rescue_from(ActionController::ParameterMissing) do |parameter_missing_exception|
        error = {title: "Missing Parameter", description: "#{parameter_missing_exception.param} parameter is required" , status: "400"}
        render_errors(error, status: :bad_request)
    end

    GRPC_CODE_TO_HTTP_CODE = {
            4 => 408,
            5 => 404,
            6 => 409,
            7 => 403,
            8 => 429,
            9 => 428,
            12 => 501,
            13 => 500,
            14 => 503,
            15 => 500,
            16 => 401
    }

    def self.skip_params_parsing(paths)
        ActionDispatch::ParamsParser.add_to_skipped_paths(paths)
    end

    #
    # Authenticates a request as either an application or user.
    #
    # @return [nil]
    def authenticate
        if authentication_method.application?
            authenticate_application
        elsif authentication_method.user?
            authenticate_user
        else
            render_unauthorized("Validation Failed", "The credentials provided are invalid")
        end
    end

    def current_device_udid
        device_id
    end

    def current_device
        if current_customer

            return current_customer.where("devices._id" => device_id).first
        else
            return nil
        end
    end

    def current_customer
        @current_customer ||= -> {
            if device_id
                return Customer.find_by("account_id" => current_account.id, "devices._id" => device_id)
            else
                return nil
            end
        }.call
    end

    def check_access
        # account token is automatically given full access
        return true if current_user.nil? && !current_account.nil?
        controller_resource = self.resource
        if controller_resource.nil?
            return false
        else
            acl = current_user.user_acl
            method = action_name
            method = "show" if action_name == "index"
            if !acl.has_access(controller_resource, method)
                render_forbidden("Access Denied", "")
            end
        end
    end

    def resource
        nil
    end

    def grpc_error_code_to_http_code(code)
        GRPC_CODE_TO_HTTP_CODE.has_key?(code) ? GRPC_CODE_TO_HTTP_CODE[code] : 500
    end


    def current_account
        @current_account ||= -> {
            if current_user
                return current_user.account
            else
                return nil
            end
        }.call
    end

    def param_should_be_array(local_params, key)
        local_params[key] ||= [] if local_params.has_key?(key)
    end

    def convert_param_if_exists(local_params, from_key, to_key)
        if !local_params.nil? && local_params.include?(from_key)
            local_params[to_key] = local_params[from_key]
            local_params.delete(from_key)
        end
    end


    def device_id_header_present
        if !request.headers.include?(APPLICATION_DEVICE_ID_HEADER)
            render_errors([{title: "Missing Header", detail: "#{APPLICATION_DEVICE_ID_HEADER} is missing", status: "400"}], {status: :bad_request})
        end
    end

    private

    def device_id
        if request.headers.include?(APPLICATION_DEVICE_ID_HEADER)
            return request.headers[APPLICATION_DEVICE_ID_HEADER].upcase
        else
            return nil
        end
    end

    def set_locale
        I18n.locale = params[:locale] || I18n.default_locale
    end

    def set_raven_context
        Raven.extra_context(params: params.to_hash, url: request.url)
    end

    #
    # Determines the authentication method used by the client
    #
    # @return [ActiveSupport::StringInquirer]
    def authentication_method
        @authentication_method ||= -> {
            if request.headers.include?(APPLICATION_API_KEY_HEADER)
                method = "application"
            elsif params.has_key?(:token) || request.headers.include?("Authorization")
                method = "user"
            else
                method = "unknown"
            end

            return ActiveSupport::StringInquirer.new(method)
        }.call
    end



    #
    # Authenticates an application using the
    #
    # @return [type] [description]
    def authenticate_application
        account = Account.find_by_token(request.headers[APPLICATION_API_KEY_HEADER])
        if account
            @current_account = account
            Raven.user_context(account_id: @current_account.id)
        else
            render_unauthorized("Validation Error", "API Token doesn't exist")
        end
    end

    def authenticate_user
        browser = Browser.new(request.user_agent)
        is_mobile_device = browser.device.mobile? || ((request.user_agent =~ EXPERIENCE_APP_USER_AGENT) != nil)

        # this is jwt authentication method
        token = request.headers["Authorization"].split(' ').last
        session = Session.find_by_token(token)
        
        if session && ( !session.expired? || is_mobile_device )
            session.track_ip_address(request.remote_ip)
            session.keep_alive
            session.save if session.changes.any?
        end

        if session.nil?
            render_unauthorized("Validation Error", "could not find the current session")
        elsif !session.verified? || session.errors.any?
            render_unauthorized("Validation Error", "the session is invalid")
        elsif session.expired?
            render_unauthorized("Validation Error", "session has expired")
        else
            @current_user = session.user
            Raven.user_context(account_id: @current_user.account_id, user_id: @current_user.id, email: @current_user.email)
        end
    end



end
