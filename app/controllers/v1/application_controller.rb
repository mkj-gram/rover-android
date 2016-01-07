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


    def application_api_key_header
        return "X-Rover-REST-API-Key"
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



    private



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
            if request.headers.include?(application_api_key_header)
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
        account = Account.find_by_token(request.headers[application_api_key_header])
        if account
            @current_account = account
        else
            render_unauthorized("Validation Error", "API Token doesn't exist")
        end
    end

    def authenticate_user
        # this is jwt authentication method
        token = params[:token] || request.headers["Authorization"].split(' ').last
        session = Session.find_by_token(token)
        if session.nil?
            render_unauthorized("Validation Error", "could not find log in token")
        elsif session.expired?
            render_unauthorized("Validation Error", "session has expired")
        else
            @current_user = session.user
        end
    end



end
