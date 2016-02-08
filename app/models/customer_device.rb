class CustomerDevice < ActiveRecord::Base

    belongs_to :customer

    before_create :create_customer

    validates :account_id, presence: true


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

    def needs_update?(new_attributes)
        new_attributes.any? do |attribute_name, value|
            modifiable_attributes.include?(attribute_name) && self.attributes[attribute_name] != value
        end
    end


    def modifiable_attributes
        @@modifiable_attributes ||= Set.new(["token", "locale_lang", "locale_region", "time_zone", "sdk_version", "platform", "os_name", "os_version", "model", "manufacturer", "carrier", "idfa", "aaid", "local_notifications_enabled", "remote_notifications_enabled", "bluetooth_enabled"])
    end


end
