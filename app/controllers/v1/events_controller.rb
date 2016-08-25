class V1::EventsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema
    before_action :device_id_header_present

    instrument_action :create

    def create
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

            meta_data = { account: current_account, device: device, customer: customer }

            object = event_attributes[:object]
            action = event_attributes[:action]

            event = Events::Pipeline.build(object, action, event_attributes, meta_data)
            event.save

            json = event.to_json

            render json: Oj.dump(json)
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
            Rails.logger.info("get_customer_and_device: customer was nil".red.bold)
            customer, device = create_customer_with_device(user_attributes, device_attributes)

        elsif (!user_attributes[:identifier].nil? && (customer.identifier.nil? || customer.identifier != user_attributes[:identifier]))
            # the identifier has changed
            Rails.logger.info("get_customer_and_device: the identifier has changed".red.bold)

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
            device = customer.devices.find{ |device| device._id == current_device_udid }
            # this uses $pull to remove from the array
            if device
                current_customer.remove_device(device)
                device.merge_attributes!(device_params(device_attributes))
                existing_customer.add_device(device)
            end
            customer = existing_customer
            customer.merge_attributes!(customer_params(user_attributes))
        elsif user_attributes[:identifier].nil? && !customer.identifier.nil?
            # user has logged out
            Rails.logger.info("get_customer_and_device: customer has logged out".red.bold)
            device = customer.devices.find{ |device| device._id == current_device_udid }
            customer.remove_device(device)
            customer, device = create_anonymous_customer(user_attributes, device_attributes)
        else
            device = customer.devices.find{ |device| device._id == current_device_udid }
            device.merge_attributes!(device_params(device_attributes))
            customer.merge_attributes!(customer_params(user_attributes))
        end
        
        # update any fields that need updating if nothing has changed
        customer.save
        return [customer, device]
    end

    def create_customer_with_device(user_attributes, device_attributes)
        # its possible here that the devices is created with an identifier
        if user_attributes[:identifier]
            # a customer
            remove_duplicate_device_by_token(device_attributes[:token])
            existing_customer = Customer.find_by(account_id: current_account.id, identifier: user_attributes[:identifier])
            
            if existing_customer
                device = existing_customer.build_device(device_params(device_attributes))
                device.udid = current_device_udid
                existing_customer.add_device(device)
                customer = existing_customer
            else
                customer = Customer.new(customer_params(user_attributes))
                device = customer.build_device(device_params(device_attributes))
                device.udid = current_device_udid
                customer.devices = [device]
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
        remove_duplicate_device_by_token(device_attributes[:token])
        user_attributes.delete(:identifier)
        customer = Customer.new(customer_params(user_attributes))
        device = customer.build_device(device_params(device_attributes))
        device.udid = current_device_udid
        customer.devices = [device]
        customer.save
        return [customer, device]
    end

    def remove_duplicate_device_by_token(token)
        return if token.nil?
        customer = Customer.find_by(account_id: current_account.id, "devices.token" => token)
        device = customer.nil? ? nil : customer.devices.find {|device| device.token == token}
        if customer && device
            Rails.logger.info("Removing device with the same push token: #{token}".red.bold)
            # old device
            customer.remove_device(device)
        end
    end

    def event_params(local_params)
        local_params.permit(:object, :action, :time)
    end

    def customer_params(user_attributes)
        allowed_params = user_attributes.permit(:identifier, :first_name, :last_name, :email, :phone_number, {:tags => []}, :age, :gender)
        # we have to manually allow traits since strong params doesn't allow unknown hashes
        allowed_params[:traits] = user_attributes.dig(:traits) || {}
        allowed_params[:account_id] = current_account.id
        return allowed_params
    end

    def device_params(local_params)
        convert_param_if_exists(local_params, :remote_notifications_enabled, :notifications_enabled)
        local_params.permit(:token, :locale_lang, :locale_region, :time_zone, :sdk_version, :app_identifier, :gimbal_mode, :platform, :os_name, :os_version, :model, :manufacturer, :carrier, :aid , :background_enabled, :notifications_enabled, :bluetooth_enabled, :location_monitoring_enabled)
    end
end
