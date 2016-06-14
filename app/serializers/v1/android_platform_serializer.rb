module V1::AndroidPlatformSerializer
    class << self
        def serialize(android_platform)
            {
                type: "android-platforms",
                id: android_platform.id.to_s,
                attributes: {
                    :"api-key" => android_platform.api_key,
                    :"package-name" => android_platform.package_name
                }
            }
        end
    end
end
