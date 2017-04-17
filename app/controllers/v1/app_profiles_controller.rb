class V1::AppProfilesController < V1::ApplicationController

    IosAppProfile = Struct.new("IosAppProfile", :app_id_prefix, :app_store_id, :bundle_id )
    AndroidAppProfile = Struct.new("AndroidAppProfile", :package_name, :sha256_cert_fingerprints)

    def show
        host = params[:host]

        if /.*\.rover\.io/ =~ host
            subdomain = host.split('.').first
            if subdomain == "inbox"
                ios_app_profile = IosAppProfile.new("WDEZX8QD47", "1191905560", "io.rover.Inbox")
                android_app_profile = nil
            else
                ios_app_profile, android_app_profile = get_profile_for_subdomain(subdomain)
            end
        else
            ios_app_profile, android_app_profile = get_profile_for_cname(host)
        end

        render_app_profile(params[:id], ios_app_profile, android_app_profile)
    end



    private


    def get_profile_for_cname(host)
        account = Account.find_by(cname: host)
        if account
            ios_platform = account.ios_platform
            android_platform = account.android_platform
            ios_app_profile  = IosAppProfile.new(ios_platform.app_id_prefix, ios_platform.app_store_id, ios_platform.bundle_id)
            android_app_profile = AndroidAppProfile.new(android_platform.package_name, android_platform.sha256_cert_fingerprints)

            return [ ios_app_profile, android_app_profile ]
        else
            return nil
        end
    end

    def get_profile_for_subdomain(subdomain)
        account = Account.find_by(subdomain: subdomain)
        if account
            ios_platform = account.ios_platform
            android_platform = account.android_platform
            ios_app_profile  = IosAppProfile.new(ios_platform.app_id_prefix, ios_platform.app_store_id, ios_platform.bundle_id)
            android_app_profile = AndroidAppProfile.new(android_platform.package_name, android_platform.sha256_cert_fingerprints)

            return [ ios_app_profile, android_app_profile ]
        else
            return nil
        end
    end


    def render_app_profile(id, ios_app_profile, android_app_profile)
        json = {
            data: {
                id: id.to_s,
                type: "app-profiles",
                attributes: {
                    :"ios" => render_ios_app_profile(ios_app_profile),
                    :"android" => render_android_app_profile(android_app_profile)
                }
            }
        }

        expires_in 5.minutes, public: false

        render json: json
    end

    def render_ios_app_profile(ios_profile)
        if ios_profile
            return {
                :"app-id-prefix" => ios_profile.app_id_prefix,
                :"app-store-id" => ios_profile.app_store_id,
                :"bundle-id" => ios_profile.bundle_id,
            }
        else
            return {}
        end
    end

    def render_android_app_profile(android_profile)
        if android_profile
            return {
                :"package-name" => android_profile.package_name,
                :"sha256-cert-fingerprints" => android_profile.sha256_cert_fingerprints
            }
        else
            return {}
        end
    end

end
