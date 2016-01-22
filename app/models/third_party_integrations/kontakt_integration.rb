class KontaktIntegration < ThirdPartyIntegration

    validates :api_key, presence: true


    def set_credentials(api_key)
        if !api_key.nil?
            self.credentials = {api_key: api_key}
        end
        return
    end

    def api_key
        if self.credentials
            self.credentials[:api_key]
        else
            nil
        end
    end


    def sync!
        client = KontaktApi.new(api_key)
        # this one could page maybe the api just grabs all of it?
        client.devices
    end
end
