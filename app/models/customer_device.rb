class CustomerDevice
    include Virtus.model(:nullify_blank => true)
    include ActiveModel::Validations
    include ActiveModel::Validations::Callbacks
    extend ActiveModel::Naming
    extend ActiveModel::Callbacks
    include VirtusDirtyAttributes

    attribute :_id, String
    attribute :token, NullableString
    attribute :locale_lang, NullableString
    attribute :locale_region, NullableString
    attribute :time_zone, NullableString
    attribute :sdk_version, NullableString
    attribute :platform, NullableString
    attribute :os_name, NullableString
    attribute :os_version, NullableString
    attribute :model, NullableString
    attribute :manufacturer, NullableString
    attribute :carrier, NullableString
    attribute :app_identifier, String
    attribute :gimbal_mode, Boolean, default: false
    attribute :location, Snapshots::Location
    attribute :background_enabled, Boolean
    attribute :notifications_enabled, Boolean
    attribute :bluetooth_enabled, Boolean
    attribute :location_monitoring_enabled, Boolean
    attribute :development, Boolean, default: false
    attribute :aid, NullableString
    # Track state of what the device is monitoring for
    attribute :beacon_regions_monitoring, Array[Snapshots::BeaconRegion], default: []
    attribute :beacon_regions_monitoring_updated_at, Time
    attribute :geofence_regions_monitoring, Array[Snapshots::GeofenceRegion], default: []
    attribute :geofence_regions_monitoring_updated_at, Time
    attribute :created_at, Time
    attribute :updated_at, Time

    alias_method :udid, :_id
    alias_method :id, :_id
    define_model_callbacks :save, :create, :update, :destroy

    before_validation { self.locale_lang = self.locale_lang.downcase if self.locale_lang }
    before_validation { self.locale_region = self.locale_region.downcase if self.locale_region }
    before_validation { self.locale_region = Iso3166.convert_alpha3_to_alpha2(self.locale_region) if self.locale_region && self.locale_region.length == 3}
    before_validation { self.carrier = self.carrier.downcase if self.carrier }
    
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

    def self.find(id)
        Customer.mongo_client[Customer.collection_name]
    end

    def as_indexed_json(options = {})
        {
            udid: self.udid,
            token: self.token,
            locale_lang: self.locale_lang,
            locale_region: self.locale_region,
            time_zone: self.time_zone,
            sdk_version: self.sdk_version,
            app_identifier: self.app_identifier,
            platform: self.platform,
            os_name: self.os_name,
            os_version: self.os_version,
            model: self.model,
            manufacturer: self.manufacturer,
            carrier: self.carrier,
            background_enabled: self.background_enabled,
            notifications_enabled: self.notifications_enabled,
            location_monitoring_enabled: self.location_monitoring_enabled,
            bluetooth_enabled: self.bluetooth_enabled,
            development: self.development,
            location: self.location && self.location.latitude && self.location.longitude ? { lat: self.location.latitude, lon: self.location.longitude } : nil
        }
    end

    def ==(other)
        self.id == other.id
    end

    def to_doc
        current_attributes = attributes
        current_attributes.delete(:token) if current_attributes.has_key?(:token) && current_attributes[:token].nil?
        current_attributes[:location] = current_attributes[:location].to_doc if current_attributes[:location]
        current_attributes[:beacon_regions_monitoring] = current_attributes[:beacon_regions_monitoring].map(&:to_doc) if current_attributes[:beacon_regions_monitoring]
        current_attributes[:geofence_regions_monitoring] = current_attributes[:geofence_regions_monitoring].map(&:to_doc) if current_attributes[:geofence_regions_monitoring]
        return current_attributes
    end

    def remote_notifications_enabled=(new_value)
        self.notifications_enabled = new_value
    end

    def customer=(customer)
        @customer = customer
    end

    def customer
        @customer
    end

    def udid=(new_udid)
        self[:_id] = new_udid.upcase
    end

    def location_updated?
        return (
            self.changes.has_key?(:location) &&
            (
                self.changes[:location].first.nil? ||
                [:latitude, :longitude].any? {|attribute| self.changes[:location].first[attribute] != self.changes[:location].last[attribute] } 
            )
        )
    end

    def device_type
        @device_type ||= platform == "iOS" ? IOS_DEVICE : ANDROID_DEVICE
    end

    def ios?
        device_type == IOS_DEVICE
    end

    def apns_device?
        ios?
    end

    def android?
        device_type == ANDROID_DEVICE
    end

    def gcm_device?
        android?
    end

    def development_device?
        self.development
    end

    def merge_attributes!(new_attributes)
        new_attributes.each do |k, v|
            self[k] = v if self.respond_to?("#{k}=")
        end
    end


    def message_attributes
        {
            "locale-lang" => locale_lang,
            "locale-region" => locale_region,
            "time-zone" => time_zone,
            "sdk-version" => sdk_version,
            "platform" => platform,
            "os-name" => os_name,
            "os-version" => os_version,
            "model" => model,
            "manufacturer" => manufacturer,
            "carrier" => carrier,
            "background-enabled" => background_enabled,
            "notifications-enabled" => notifications_enabled,
            "bluetooth-enabled" => bluetooth_enabled,
            "location-monitoring-enabled" => location_monitoring_enabled
        }
    end


    class << self
        def from_document(doc)
            return CustomerDevice.new(doc.merge(new_record: false))
        end

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
        if self.locale_region && !Iso3166.alpha2_exists?(self.locale_region)
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
