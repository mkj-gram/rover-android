class CustomerDevice < ActiveRecord::Base

    belongs_to :customer
    validates :account_id, presence: true

    before_create :create_customer, if: -> { customer_id.nil? }
    after_update :reindex_customer

    IOS_DEVICE = 1
    ANDROID_DEVICE = 2

    def as_indexed_json(options = {})
        {
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
            local_notifications_enabled: self.local_notifications_enabled,
            remote_notifications_enabled: self.remote_notifications_enabled,
            location_monitoring_enabled: self.location_monitoring_enabled,
            bluetooth_enabled: self.bluetooth_enabled
        }
    end


    def device_type
        @device_type ||= os_name == "iOS" ? IOS_DEVICE : ANDROID_DEVICE
    end

    def ios?
        device_type == IOS_DEVICE
    end

    def android?
        device_type == ANDROID_DEVICE
    end

    def update_attributes_async(new_attributes)
        merge(new_attributes)
        if needs_update?
            UpdateCustomerDeviceAttributesWorker.perform_async(self.id, new_attributes)
        end
    end

    def merge(new_attributes)
        new_attributes.each do |attribute, value|
            self[attribute] = value
        end
    end

    private

    def create_customer
        Rails.logger.info("Creating customer")
        customer = Customer.create(account_id: self.account_id)
        self.customer_id = customer.id if customer
    end

    def reindex_customer
        if self.customer
            self.customer.reindex_devices
        end
    end

    def needs_update?
        changes.any?
    end


    def modifiable_attributes
        @@modifiable_attributes ||= Set.new(["token", "locale_lang", "locale_region", "time_zone", "sdk_version", "platform", "os_name", "os_version", "model", "manufacturer", "carrier", "idfa", "aaid", "local_notifications_enabled", "remote_notifications_enabled", "bluetooth_enabled"])
    end


end
