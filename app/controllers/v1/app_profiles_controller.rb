class V1::AppProfilesController < V1::ApplicationController
   

    def show
        account = Account.find_by(subdomain: params[:id])
        if account
            ios_platform = account.ios_platform
            android_platform = account.android_platform
            
            json = {
                data: {
                    id: params[:id],
                    attributes: {
                        :"app-id-prefix" => ios_platform.app_id_prefix,
                        :"app-store-id" => ios_platform.app_store_id,
                        :"bundle-id" => ios_platform.bundle_id, 
                    }
                }
            }

            expires_in 5.minutes, public: false
            render json: json
        else
            head :not_found
        end
    end

end
