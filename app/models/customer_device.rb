class CustomerDevice < ActiveRecord::Base

    belongs_to :customer
    validates :account_id, presence: true

    before_create :create_customer
    after_update :reindex_customer



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


    def update_attributes_async(new_attributes)
        if needs_update?(new_attributes)
            UpdateCustomerDeviceAttributesWorker.perform_async(self.id, new_attributes)
        end
    end


    private

    def create_customer
        if customer_id.nil?
            self.customer = Customer.create(account_id: self.account_id)
        end
    end

    def reindex_customer
        self.customer.__elasticsearch__.update_document if self.customer
    end

    def needs_update?(new_attributes)
        new_attributes.any? do |attribute_name, value|
            modifiable_attributes.include?(attribute_name) && self.attributes[attribute_name] != value
        end
    end


    def modifiable_attributes
        @@modifiable_attributes ||= Set.new(["token", "locale_lang", "locale_region", "time_zone", "sdk_version", "platform", "os_name", "os_version", "model", "manufacturer", "carrier", "idfa", "aaid", "local_notifications_enabled", "remote_notifications_enabled", "bluetooth_enabled"])
    end


end
