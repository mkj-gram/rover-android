module V1::AndroidPlatformSerializer
    class << self
        def serialize(android_platform)
            {
                id: android_platform.id.to_s,
                attributes: {

                }
            }
        end
    end
end
