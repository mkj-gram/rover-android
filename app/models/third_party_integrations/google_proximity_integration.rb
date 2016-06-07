class GoogleIntegration < ThirdPartyIntegration

    # validates :api_key, presence: true

    def self.model_type
        @@model_type ||= "google-integration"
    end

    def self.model_type_pluralized
        @@model_type_pluralized ||= "google-integrations"
    end

    def model_type(opts = {})
        should_pluralize = opts.fetch(:pluralize, true)
        should_pluralize ? GoogleIntegration.model_type_pluralized : GoogleIntegration.model_type
    end

    def sync!
        stats = {
            added_devices_count: 0,
            modified_devices_count: 0,
            removed_devices_count: 0,
            devices_changed_configuration_count: 0
        }
        return stats
    end


    def access_token
        # grab the url
        token = Google::Auth::UserRefreshCredentials.new(
            client_id: GoogleOauth.client_id,
            client_secret: GoogleOauth.client_secret,
            scope: credentials['scope'] || GoogleOauth.scope,
            access_token: credentials['access_token'],
            refresh_token: credentials['refresh_token'],
            expires_at: credentials.fetch('expiration_time_millis', 0) / 1000
        )

        if Time.zone.now > token.expires_at
            token.refresh!
            self.credentials = {
                client_id: token.client_id,
                access_token: token.access_token,
                refresh_token: token.refresh_token,
                scope: token.scope,
                expiration_time_millis: (token.expires_at.to_i) * 1000
            }
            self.save
        end

        return token
    end

end
