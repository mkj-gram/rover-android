require 'googleauth'
module GoogleOauthSettings
    class << self


        def client_id
            @client_id ||= Google::Auth::ClientId.new(Rails.configuration.google_oauth["client_id"], Rails.configuration.google_oauth["client_secret"])
        end

        def default_scope
            @default_scope ||= Rails.configuration.google_oauth["default_scope"].split(',')
        end

        def callback_base_url
            @callback_base_url ||= Rails.configuration.google_oauth["callback_base_url"]
        end

        def authorizer
            @authorizer ||= Google::Auth::UserAuthorizer.new(client_id, default_scope, nil, 'google')
        end


        def get_credentials_from_code(opts = {})
            code = opts.delete(:code)
            scope = opts.delete(:scope) || default_scope
            base_url = opts.delete(:base_url) || callback_base_url
            credentials = Google::Auth::UserRefreshCredentials.new(
                client_id: client_id.id,
                client_secret: client_id.secret,
                redirect_uri: URI.join(base_url, 'google'),
                scope: scope
            )
            credentials.code = code
            credentials.fetch_access_token!({})
            return credentials
        end


    end

end
