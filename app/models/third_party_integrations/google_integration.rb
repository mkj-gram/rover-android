require 'googleauth'
require 'google/apis/proximitybeacon_v1beta1'
class GoogleIntegration < ThirdPartyIntegration

    after_save :create_sync_job!, if: -> { project_id_changed && access_token }
    after_destroy :revoke_access_token

    has_many :sync_jobs, class_name: "GoogleSyncJob", foreign_key:  "third_party_integration_id" do

        def latest
            last
        end

        def previous
            last(2).last
        end
    end

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

    def project_id
        self.credentials.nil? ? nil : self.credentials["project_id"]
    end

    def project_id=(id)
        @project_id_changed = true if project_id != id
        self.credentials = (credentials || {}).merge("project_id" => id)
    end

    def project_id_changed
        @project_id_changed ||= false
    end

    def credentials_json
        {}
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
        return nil if  !([:client_id, :scope, :access_token, :refresh_token, :expiration_time_millis].all? { |property| credentials.has_key?(property) })
        # grab the url
        token = Google::Auth::UserRefreshCredentials.new(
            client_id: GoogleOauthSettings.client_id.id,
            client_secret: GoogleOauthSettings.client_id.secret,
            scope: credentials[:scope] || GoogleOauthSettings.default_scope,
            access_token: credentials[:access_token],
            refresh_token: credentials[:refresh_token],
            expires_at: credentials.fetch(:expiration_time_millis, 0) / 1000
        )

        if Time.zone.now > token.expires_at
            token.refresh!
            new_credentials = {
                project_id: self.project_id,
                client_id: token.client_id,
                access_token: token.access_token,
                refresh_token: token.refresh_token,
                scope: token.scope,
                expiration_time_millis: (token.expires_at.to_i) * 1000
            }
            self.update(credentials: new_credentials)
        end

        return token
    end

    private

    def revoke_access_token
        return if access_token.nil?
        access_token.revoke!
    end


end
