class V1::AppProfilesController < V1::ApplicationController

    AppProfile = Struct.new("AppProfile", :id, :app_id_prefix, :app_store_id, :bundle_id )

    def show

        if params[:id] == "inbox"
            profile = AppProfile.new("inbox", "WDEZX8QD47", "1191905560", "io.rover.Inbox")
        else
            profile = get_profile_for_id(params[:id])
        end

        render_app_profile(profile)
    end



    private

    def get_profile_for_id(id)
        account = Account.find_by(subdomain: id)
        if account
            ios_platform = account.ios_platform
            android_platform = account.android_platform
            return AppProfile.new(id, ios_platform.app_id_prefix, ios_platform.app_store_id, ios_platform.bundle_id)
        else
            return nil
        end
    end


    def render_app_profile(profile)
        if profile
            json = {
                data: {
                    id: profile.id,
                    attributes: {
                        :"app-id-prefix" => profile.app_id_prefix,
                        :"app-store-id" => profile.app_store_id,
                        :"bundle-id" => profile.bundle_id,
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
