class V1::GoogleOauthController < V1::ApplicationController
    before_action :authenticate

    allow :admin, :server
    
    def show
        url = GoogleOauthSettings.authorizer.get_authorization_url(base_url: GoogleOauthSettings.callback_base_url)
        render json: { url: url }
    end

end
