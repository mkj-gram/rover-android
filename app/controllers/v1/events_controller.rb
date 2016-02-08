require 'signature_helper'
class V1::EventsController < V1::ApplicationController
    before_action :authenticate
    before_action :validate_json_schema

    # {
    #     "data": {
    #         "type": "events",
    #         "attributes": {
    #             "object": "app",
    #             "action": "opened",
    #             "user": {
    #                 "alias": "bob@gmail.com",
    #                 "traits": {"gold_plus": true, "interests": ["basketball", "painting"]}
    #             }
    #         }
    #     }
    # }

    def create
        # create the event and the device or the user

        json = flatten_request({single_record: true})
        event_attributes = json.dig(:data, :events)

        device = get_device(event_attributes)
        user_attributes = get_customer(device, event_attributes.fetch(:user, {}))

        event = Event.new()
        event.save

        json = {
            "data" => []
        }
        render json: Customer.all
    end


    private

    # if the alias has changed then we need to update before inserting into the db
    def get_device(event_attributes)
        device = CustomerDevice.find_by_udid(event_attributes.dig(:device, :udid))
        if device.nil?
            device = build_device(event_attributes)
            device.account_id = current_account.id
            device.save
        end

        return device
    end

    def build_device(event_attributes)
        device = CustomerDevice.new(device_params(event_attributes))
        user_alias = event_attributes.dig(:user, :alias)
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

        current_customer.update_attributes_async(user_attributes)
    end

    def create_customer(user_attributes)
        customer = Customer.new(customer_params(user_attributes))
        customer.account_id = current_account.id
        customer.save
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
        convert_param_if_exists(user_attributes, :"phone-number", :phone_number)
        allowed_params = user_attributes.permit(:alias, :name, :email, :phone_number, {:tags => []})
        # we have to manually allow traits since strong params doesn't allow unknown hashes
        allowed_params[:traits] = user_attributes.dig(:traits) || {}
    end

    def device_params(local_params)
        local_params.fetch(:device, {}).permit(:udid, :token, :locale_lang, :locale_region, :time_zone, :sdk_version, :platform, :os_name, :os_version, :model, :manufacturer, :carrier, :idfa, :aaid)
    end
end
