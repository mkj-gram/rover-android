class CustomerDevice
    include Mongoid::Document

    field :_id, as: :udid, type: String

    field :token, type: String
    field :locale_lang, type: String
    field :locale_region, type: String
    field :time_zone, type: String
    field :sdk_version, type: String
    field :platform, type: String
    field :os_name, type: String
    field :os_version, type: String
    field :model, type: String
    field :manufacturer, type: String
    field :carrier, type: String
    field :background_enabled, type: Boolean
    field :local_notifications_enabled, type: Boolean
    field :remote_notifications_enabled, type: Boolean
    field :bluetooth_enabled, type: Boolean
    field :location_monitoring_enabled, type: Boolean
    field :aid, type: String

    embedded_in :customer

    before_validation { self.locale_lang = self.locale_lang.downcase if self.locale_lang? }
    before_validation { self.locale_region = self.locale_region.downcase if self.locale_region? }

    validate :valid_locale_lang
    validate :valid_locale_region
    validate :valid_platform
    validate :valid_os_name
    validate :valid_time_zone
    validates :os_version, version: true
    validates :sdk_version, version: true


    IOS_DEVICE = 1
    ANDROID_DEVICE = 2
    PLATFORMS = Set.new(["iOS", "Android"]).freeze
    OS_NAMES = Set.new(["iOS", "Android"]).freeze

    def as_indexed_json(options = {})
        {
            udid: self.udid,
            token: self.token,
            locale_lang: self.locale_lang,
            locale_region: self.locale_region,
            time_zone: self.time_zone,
            sdk_version: self.sdk_version,
            platform: self.platform,
            os_name: self.os_name,
            os_version: self.os_version,
            model: self.model,
            manufacturer: self.manufacturer,
            carrier: self.carrier,
            background_enabled: self.background_enabled,
            local_notifications_enabled: self.local_notifications_enabled,
            remote_notifications_enabled: self.remote_notifications_enabled,
            location_monitoring_enabled: self.location_monitoring_enabled,
            bluetooth_enabled: self.bluetooth_enabled
        }
    end

    def udid=(val)
        self[:udid] = val.downcase
    end

    def device_type
        @device_type ||= platform == "iOS" ? IOS_DEVICE : ANDROID_DEVICE
    end

    def ios?
        device_type == IOS_DEVICE
    end

    def android?
        device_type == ANDROID_DEVICE
    end

    private

    def valid_time_zone
        if self.time_zone && !ActiveSupport::TimeZone[self.time_zone].present?
            errors.add(:time_zone, "invalid")
        end
    end

    def valid_locale_lang
        if self.locale_lang && !Iso639.exists?(self.locale_lang)
            errors.add(:locale_lang, "invalid ISO639 code")
        end
    end

    def valid_locale_region
        if self.locale_region && !Iso3166.exists?(self.locale_region)
            errors.add(:locale_region, "invalid ISO3166 code")
        end
    end

    def valid_platform
        if self.platform && !PLATFORMS.include?(self.platform)
            errors.add(:platform, "invalid")
        end
    end

    def valid_os_name
        if self.os_name && !OS_NAMES.include?(self.os_name)
            errors.add(:os_name, "invalid")
        end
    end

    # def update_attributes_async(new_attributes)
    #     merge(new_attributes)
    #     if needs_update?
    #         UpdateCustomerDeviceAttributesWorker.perform_async(self.id, new_attributes)
    #     end
    # end

    # def merge(new_attributes)
    #     new_attributes.each do |attribute, value|
    #         self[attribute] = value
    #     end
    # end

    # private

    # def create_customer
    #     Rails.logger.info("Creating customer")
    #     customer = Customer.create(account_id: self.account_id)
    #     self.customer_id = customer.id if customer
    # end

    # def reindex_customer
    #     if self.customer
    #         self.customer.reindex_devices
    #     end
    # end

    # def needs_update?
    #     changes.any?
    # end


    # def modifiable_attributes
    #     @@modifiable_attributes ||= Set.new(["token", "locale_lang", "locale_region", "time_zone", "sdk_version", "platform", "os_name", "os_version", "model", "manufacturer", "carrier", "idfa", "aaid", "local_notifications_enabled", "remote_notifications_enabled", "bluetooth_enabled"])
    # end


end
