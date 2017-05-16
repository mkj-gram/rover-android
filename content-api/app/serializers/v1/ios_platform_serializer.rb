module V1::IosPlatformSerializer
    class << self
        def serialize(ios_platform)
            {
                type: "ios-platforms",
                id: ios_platform.id.to_s,
                attributes: {
                    :"name" => ios_platform.title,
                    :"bundle-id" => ios_platform.bundle_id,
                    :"certificate-expires-at" => ios_platform.certificate_expires_at,
                    :"certificate-filename" => ios_platform.certificate_filename,
                    :"app-id-prefix" => ios_platform.app_id_prefix, 
                    :"app-store-id" => ios_platform.app_store_id
                }
            }
        end
    end
end
