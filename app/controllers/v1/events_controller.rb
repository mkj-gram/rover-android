class V1::EventsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema


    def create
        json = flatten_request({single_record: true})

        event_attributes = json.dig(:data, :events)

        device_attributes = event_attributes.delete(:device) || {}
        user_attributes = event_attributes.delete(:user) || {}

        device = get_device(device_attributes, user_attributes)
        customer = get_customer(device, user_attributes)

        attributes = event_attributes.merge({device: device, customer: customer})
        event = Event.create_event(attributes)
        event.save

        json = event.json_response

        render json: json
    end


    private

    def get_device(device_attributes, user_attributes)
        device = device_attributes[:udid].nil? ? nil : CustomerDevice.find_by_udid(device_attributes[:udid])
        if device.nil?
            device = build_device(device_attributes, user_attributes)
            device.account_id = current_account.id
            device.save
        end
        device.update_attributes_async(device_params(device_attributes))
        # check to see if the device_attributes need updating
        return device
    end

    def build_device(device_attributes, user_attributes)
        device = CustomerDevice.new(device_params(device_attributes))
        user_alias = user_attributes[:alias]
        if !user_alias.nil?
            # they are creating a device with an alias, rare but could happen
            customer = Customer.find_by(account_id: current_account.id, alias: user_alias)
            device.customer = customer if customer
        end
        return device
    end


    def get_customer(device, user_attributes)
        current_customer = device.customer
        new_customer_alias = user_attributes.dig(:alias)

        if current_customer.alias.nil? && !new_customer_alias.nil? && !(existing_customer = Customer.find_by(account_id: current_account.id, alias: new_customer_alias)).nil?
            device.customer = existing_customer
            device.save
            current_customer = existing_customer
        elsif !current_customer.alias.nil? && new_customer_alias.nil?
            # the customer has logged out create a new anonymous customer
            new_customer = create_customer(user_attributes)
            device.customer = new_customer
            device.save
            current_customer = new_customer
        end

        current_customer.update_attributes_async(customer_params(user_attributes))
        current_customer.merge(customer_params(user_attributes))
        return current_customer
    end

    def create_customer(user_attributes)
        begin
            customer = Customer.new(customer_params(user_attributes))
            customer.account_id = current_account.id
            customer.save
        rescue ActiveRecord::RecordNotUnique => e
            # this happens when 2 request come at the exact same time
            # User with 2 devices update their attributes at the exact same time
            # Super rare but we don't want to 500 internal
            customer = Customer.find_by(account_id: current_account.id, alias: new_customer_alias)
        end
        return customer
    end

    def update_customer_attributes_async(device, attributes)
        # first check to see if we really need an update
        customer_id = device.customer_id
        customer_alias = device.customer_alias
        traits = attributes.dig(:traits)
        new_attributes_hash_code = {id: customer_id, alias: customer_alias, traits: traits}.hash
        if device.customer_attributes_hashcode != new_attributes_hash_code
            Rails.logger.info("The customer #{customer_id} needs updated")
            UpdateCustomerAttributesWorker.perform_async(customer_id, {traits: traits})
        end
    end

    def event_params(local_params)
        local_params.permit(:object, :action, :time)
    end

    def customer_params(user_attributes)
        allowed_params = user_attributes.permit(:alias, :name, :email, :phone_number, {:tags => []})
        # we have to manually allow traits since strong params doesn't allow unknown hashes
        allowed_params[:traits] = user_attributes.dig(:traits) || {}
        return allowed_params
    end

    def device_params(local_params)
        local_params.permit(:udid, :token, :locale_lang, :locale_region, :time_zone, :sdk_version, :platform, :os_name, :os_version, :model, :manufacturer, :carrier, :aid , :local_notifications_enabled, :remote_notifications_enabled, :bluetooth_enabled, :location_monitoring_enabled)
    end
end
