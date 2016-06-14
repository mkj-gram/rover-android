module V1::IosPlatformSerializer
    class << self
        def serialize(ios_platform)
            {
                id: ios_platform.id.to_s,
                attributes: {
                	:"name" => ios_platform.title,
                	:"certificate-expires-at" => ios_platform.certificate_expires_at,
                	:"certificate-filename" => ios_platform.certificate_filename,
                }
            }
        end
    end
end
