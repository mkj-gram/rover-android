class V1::CustomerDeviceErrorSerializer < ModelError::Serializer
    attribute :locale_lang, error_key: "locale-lang"
    attribute :locale_region, error_key: "locale-region"
    attribute :time_zone, error_key: "time-zone"
    attribute :sdk_version, error_key: "sdk-version"
    attribute :platform
    attribute :os_name, error_key: "os-name"
    attribute :os_version, error_key: "os-version"
end
