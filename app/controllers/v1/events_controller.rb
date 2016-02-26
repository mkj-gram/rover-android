class V1::EventsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema


    def create
        json = flatten_request({single_record: true})

        event_attributes = json.dig(:data, :events)

        device_attributes = ActionController::Parameters.new(event_attributes.delete(:device) || {})
        user_attributes = ActionController::Parameters.new(event_attributes.delete(:user) || {})

        customer, device = get_customer_and_device(user_attributes, device_attributes)

        attributes = event_attributes.merge({account: current_account, device: device, customer: customer})

        event = Event.build_event(attributes)
        event.save

        json = event.to_json

        render json: json
    end


    private

    def get_customer_and_device(user_attributes, device_attributes)
        # first check to see if a customer has the device
        device_udid = device_attributes[:udid]

        customer = Customer.find_by("devices._id" => device_udid)
        device = customer.devices.where("_id" => device_udid).first
        if customer.nil?
            # there is no customer with this device
            # lets create a customer with this device
            customer = create_customer_with_device(user_attributes, device_attributes)
            # next line uses an in memory find
            device = customer.devices.where("_id" => device_udid).first
        elsif !user_attributes[:identifier].nil? && customer.identifier.nil?
            # an anonymous user has logged in
            existing_customer = Customer.find_by(account_id: current_account.id, identifier: user_attributes[:identifier])
            if existing_customer.nil?
                # no customer with the identifier exists so lets just update the current one
                customer.update_attributes({identifier: user_attributes[:identifier]})
            else
                # this is the case where an anonymous user logged in and their profile already exists on our system
                # we want to transfer the device from the current customer to the existing one
                device = customer.devices.where("_id" => device_udid).first
                # this uses $pull to remove from the array
                device.delete
                transfer_device = existing_customer.devices.new(device.attributes)
                # this $pushes onto the array
                transfer_device.save
                device = transfer_device
            end

        elsif user_attributes.has_key?(:identifier) && user_attributes[:identifier].nil? && !customer.identifier.nil?
            # the developer has logged the user out
            # the identifier has specifically been set to null by the device
            # i.e stopped tracking the customer_params
            device = customer.devices.where("_id" => device_udid).first
            # delete the device
            device.delete
            # create a new customer with this device
            customer = create_anonymous_customer(user_attributes, device_attributes)
            device = customer.devices.where("_id" => device_udid).first
        end

        # check to see if the customer or device needs updating
        # if the identifier changed we want to switch it here and not in the background
        # customer.update_attributes_async(user_attributes, device_attributes)
        return [customer, device]
    end

    def create_customer_with_device(user_attributes, device_attributes)
        # its possible here that the devices is created with an indentifier
        if user_attributes[:identifier]
            # a customer
            existing_customer = Customer.find_by(account_id: current_account.id, indentifier: user_attributes[:identifier])
            if existing_customer
                # this calls $push on the devices array for the existing customer
                device = existing_customer.devices.new(device_params(device_attributes))
                device.update
                customer = existing_customer
            else
                customer = Customer.new(customer_params(user_attributes))
                device = customer.devices.build(device_params(device_attributes))
                customer.save
            end
        else
            customer = create_anonymous_customer(user_attributes, device_attributes)
        end
        return customer
    end


    def create_anonymous_customer(user_attributes, device_attributes)
        # this is the case where we create a customer without an identifier
        # make sure incase if someone calls this function they aren't setting the identifier
        user_attributes.delete(:identifier)
        customer = Customer.new(customer_params(user_attributes))
        device = customer.devices.build(device_params(device_attributes))
        if customer.save
            return customer
        else
            nil
        end
    end

    def event_params(local_params)
        local_params.permit(:object, :action, :time)
    end

    def customer_params(user_attributes)
        allowed_params = user_attributes.permit(:identifier, :name, :email, :phone_number, {:tags => []})
        # we have to manually allow traits since strong params doesn't allow unknown hashes
        allowed_params[:traits] = user_attributes.dig(:traits) || {}
        allowed_params[:account_id] = current_account.id
        return allowed_params
    end

    def device_params(local_params)
        local_params.permit(:udid, :token, :locale_lang, :locale_region, :time_zone, :sdk_version, :platform, :os_name, :os_version, :model, :manufacturer, :carrier, :aid , :background_enabled, :local_notifications_enabled, :remote_notifications_enabled, :bluetooth_enabled, :location_monitoring_enabled)
    end
end
