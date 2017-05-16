module V1::AndroidPlatformSerializer
    class << self
        def serialize(android_platform)
            {
                type: "android-platforms",
                id: android_platform.id.to_s,
                attributes: {
                    :"api-key" => android_platform.api_key,
                    :"sender-id" => android_platform.sender_id,
                    :"messaging-token" => android_platform.messaging_token,
                    :"package-name" => android_platform.package_name,
                    :"sha256-cert-fingerprints" => android_platform.sha256_cert_fingerprints
                }
            }
        end
    end
end
