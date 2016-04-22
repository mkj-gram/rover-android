module V1::IosPlatformSerializer
    class << self
        def serialize(ios_platform)
            {
                id: ios_platform.id.to_s,
                attributes: {

                }
            }
        end
    end
end
