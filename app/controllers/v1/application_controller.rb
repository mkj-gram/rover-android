class V1::ApplicationController < ActionController::API
    include ::ActionController::Serialization
    include Rails.application.routes.url_helpers
    include PageHelper
    include OrderHelper
    include IncludeHelper
    include AccessHelper
    include JsonHelper
    include RenderHelper

    # set the scope to the view context so we can use Rails url_helper like v1_users_path(@user)
    serialization_scope :view_context

    before_action :set_locale

    attr_reader :current_user, :current_account

    APPLICATION_API_KEY_HEADER = "X-Rover-Api-Key".freeze
    APPLICATION_DEVICE_ID_HEADER = "X-Rover-Device-Id".freeze


    rescue_from(ActionController::ParameterMissing) do |parameter_missing_exception|
        error = {title: "Missing Parameter", description: "#{parameter_missing_exception.param} parameter is required" , status: "400"}
        render_errors(error, status: :bad_request)
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




    # TODO FIX THIS BUG
    # why are you finding by id?
    def current_account
        @current_account ||= -> {
            if params.has_key?(:account_id)
                return Account.find_by_id(params[:account_id])
            elsif current_user
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

    private

    def device_id
        if request.headers.include?(APPLICATION_DEVICE_ID_HEADER)
            return request.headers[APPLICATION_DEVICE_ID_HEADER]
        else
            return nil
        end
    end


    def acl_path
        return "#{controller_name}_#{action_name}"
    end

    def set_locale
        I18n.locale = params[:locale] || I18n.default_locale
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
        else
            render_unauthorized("Validation Error", "API Token doesn't exist")
        end
    end

    def authenticate_user
        # this is jwt authentication method
        token = request.headers["Authorization"].split(' ').last
        session = Session.find_by_token(token)
        if session.nil?
            render_unauthorized("Validation Error", "could not find the current session")
        elsif !session.verified? || session.errors.any?
            render_unauthorized("Validation Error", "the session is invalid")
        elsif session.expired?
            render_unauthorized("Validation Error", "session has expired")
        else
            @current_user = session.user
        end
    end



end
