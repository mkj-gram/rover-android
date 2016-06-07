require 'googleauth'
module GoogleOauthSettings
    class << self


        def client_id
            @client_id ||= Google::Auth::ClientId.new(Rails.configuration.google_oauth["client_id"], Rails.configuration.google_oauth["client_secret"])
        end

        def default_scope
            @default_scope ||= Rails.configuration.google_oauth["default_scope"]
        end

        def callback_base_url
            @callback_base_url ||= Rails.configuration.google_oauth["callback_base_url"]
        end

        def authorizer
            @authorizer ||= Google::Auth::UserAuthorizer.new(client_id, default_scope, nil, 'google-oauth-callback')
        end


    end

end
