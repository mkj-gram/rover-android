class V1::EventsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema
    before_action :device_id_header_present

    instrument_action :create

    def create
        head :internal_error
        return
        json = flatten_request({single_record: true, except: "attributes.user.traits"})

        event_attributes = json.dig(:data, :events)

        device_attributes = ActionController::Parameters.new(event_attributes.delete(:device) || {})
        user_attributes = ActionController::Parameters.new(event_attributes.delete(:user) || {})

        customer, device = get_customer_and_device(user_attributes, device_attributes)



        if !device.valid?
            render json: { errors: V1::CustomerDeviceErrorSerializer.serialize(device.errors)}, status: :unprocessable_entity
        elsif !customer.valid?
            render json: { errors: V1::CustomerErrorSerializer.serialize(customer.errors)}, status: :unprocessable_entity
        else
            Raven.user_context(account_id: current_account.id, customer_id: customer.id, customer_identifier: customer.identifier, customer_name: customer.name)

            attributes = event_attributes.merge({account: current_account, device: device, customer: customer})

            object = event_attributes[:object]
            action = event_attributes[:action]

            event = Events::Pipeline.build(object, action, attributes)
            event.save

            json = event.to_json

            render json: json
        end
    end


    private

    def get_customer_and_device(user_attributes, device_attributes)
        # first check to see if a customer has the device
        # device_udid = device_attributes[:udid]
        user_attributes[:identifier] = nil if !user_attributes[:identifier].nil? && user_attributes[:identifier].empty?
        customer = current_customer

        if customer.nil?
            # there is no customer with this device
            # lets create a customer with this device
            customer, device = create_customer_with_device(user_attributes, device_attributes)
            puts "customer was nil"
        elsif (!user_attributes[:identifier].nil? && (customer.identifier.nil? || customer.identifier != user_attributes[:identifier]))
            # the identifier has changed
            existing_customer = Customer.find_by(account_id: current_account.id, identifier: user_attributes[:identifier])
            if existing_customer.nil?
                # we want a new customer object here because we don't
                # want to merge the analytics
                # the next block takes care of tranfering the device over
                existing_customer = Customer.new(customer_params(user_attributes))
                if !existing_customer.save
                    return [existing_customer, nil]
                end
            end
            # this is the case where an anonymous user logged in and their profile already exists on our system
            # we want to transfer the device from the current customer to the existing one
            device = customer.devices.where("_id" => current_device_udid).first
            # this uses $pull to remove from the array
            if device
                device.delete
                transfer_device = existing_customer.devices.new(device.attributes)
                # this $pushes onto the array
                transfer_device.save
                device = transfer_device
            end
            customer = existing_customer
        else
            device = customer.devices.where("_id" => current_device_udid).first
        end

        # update any fields that need updating if nothing has changed
        # update_attributes performs a no-op
        customer.update_attributes(customer_params(user_attributes)) if customer
        device.update_attributes(device_params(device_attributes)) if device
        return [customer, device]
    end

    def create_customer_with_device(user_attributes, device_attributes)
        # its possible here that the devices is created with an identifier
        if user_attributes[:identifier]
            # a customer
            existing_customer = Customer.find_by(account_id: current_account.id, identifier: user_attributes[:identifier])
            if existing_customer
                # this calls $push on the devices array for the existing customer
                device = existing_customer.devices.new(device_params(device_attributes))
                device.udid = current_device_udid
                device.update
                customer = existing_customer
            else
                customer = Customer.new(customer_params(user_attributes))
                device = customer.devices.build(device_params(device_attributes))
                device.udid = current_device_udid
                customer.save
            end
            return [customer, device]
        else
            return create_anonymous_customer(user_attributes, device_attributes)
        end

    end


    def create_anonymous_customer(user_attributes, device_attributes)
        # this is the case where we create a customer without an identifier
        # make sure incase if someone calls this function they aren't setting the identifier
        user_attributes.delete(:identifier)
        customer = Customer.new(customer_params(user_attributes))
        device = customer.devices.build(device_params(device_attributes))
        device.udid = current_device_udid
        return [customer, device]
    end

    def event_params(local_params)
        local_params.permit(:object, :action, :time)
    end

    def customer_params(user_attributes)
        allowed_params = user_attributes.permit(:identifier, :name, :email, :phone_number, {:tags => []}, :age, :gender)
        # we have to manually allow traits since strong params doesn't allow unknown hashes
        allowed_params[:traits] = user_attributes.dig(:traits) || {}
        allowed_params[:account_id] = current_account.id
        return allowed_params
    end

    def device_params(local_params)
        local_params.permit(:token, :locale_lang, :locale_region, :time_zone, :sdk_version, :platform, :os_name, :os_version, :model, :manufacturer, :carrier, :aid , :background_enabled, :local_notifications_enabled, :remote_notifications_enabled, :bluetooth_enabled, :location_monitoring_enabled)
    end
end
