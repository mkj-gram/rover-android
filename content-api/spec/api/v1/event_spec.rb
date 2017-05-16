require 'rails_helper'

describe "/v1/events", :type => :request do

    it 'creates a device then updates the user identifier' do
        account = create(:account)
        device = attributes_for(:customer_device)


        first_event = {
            data: {
                type: "events",
                attributes: {
                    object: "app",
                    action: "open",
                    device: device,
                    user: {}
                }
            }
        }
        post_json '/v1/events', first_event, signed_request_header(account, device[:udid])

        expect(response).to have_http_status(200)


        user = attributes_for(:customer)
        user[:"phone-number"] = user[:phone_number]
        user[:identifier] = "example"
        second_event = {
            data: {
                type: "events",
                attributes: {
                    object: "app",
                    action: "open",
                    device: device,
                    user: user
                }
            }
        }

        post_json '/v1/events', second_event, signed_request_header(account, device[:udid])

        expect(response).to have_http_status(200)

        expect(Customer.count).to eq(2)
        customer_1 = Customer.find_by("account_id" => account.id, "devices._id" => device[:udid])
        expect(customer_1).not_to eq(nil)
        expect(customer_1.devices.count).to eq(1)
    end

    it 'updates the devices sdk version' do
        account = create(:account)
        device = attributes_for(:customer_device)

        first_event = {
            data: {
                type: "events",
                attributes: {
                    object: "app",
                    action: "open",
                    device: device,
                    user: {}
                }
            }
        }
        post_json '/v1/events', first_event, signed_request_header(account, device[:udid])

        expect(response).to have_http_status(200)

        device[:sdk_version] = "4.0.1"
        second_event = {
            data: {
                type: "events",
                attributes: {
                    object: "app",
                    action: "open",
                    device: device,
                    user: {}
                }
            }
        }

        post_json '/v1/events', second_event, signed_request_header(account, device[:udid])

        expect(response).to have_http_status(200)
        expect(Customer.first.devices.last.sdk_version).to eq("4.0.1")

    end

    it 'transfers a device from one customer to another' do
        account = create(:account)
        device1 = attributes_for(:customer_device)
        device2 = attributes_for(:customer_device)

        create_device1 = {
            data: {
                type: "events",
                attributes: {
                    object: "app",
                    action: "open",
                    device: device1,
                    user: {
                        identifier: "example"
                    }
                }
            }
        }

        create_device2 = {
            data: {
                type: "events",
                attributes: {
                    object: "app",
                    action: "open",
                    device: device2,
                    user: {}
                }
            }
        }

        post_json '/v1/events', create_device1, signed_request_header(account, device1[:udid])

        expect(response).to have_http_status(200)

        post_json '/v1/events', create_device2, signed_request_header(account, device2[:udid])

        expect(response).to have_http_status(200)

        swap_device2_to_first_customer = {
            data: {
                type: "events",
                attributes: {
                    object: "app",
                    action: "open",
                    device: device2,
                    user: {
                        identifier: "example"
                    }
                }
            }
        }

        post_json '/v1/events', swap_device2_to_first_customer, signed_request_header(account, device2[:udid])

        expect(response).to have_http_status(200)

        customer_1 = Customer.find_by("account_id" => account.id, "devices._id" => device1[:udid])
        expect(customer_1).not_to eq(nil)
        expect(customer_1.devices.count).to eq(2)

    end

    it 'creates an identified customer then logs out' do
        account = create(:account)
        device = attributes_for(:customer_device)


        create_identified_customer = {
            data: {
                type: "events",
                attributes: {
                    object: "app",
                    action: "open",
                    device: device,
                    user: {
                        identifier: "example"
                    }
                }
            }
        }
        post_json '/v1/events', create_identified_customer, signed_request_header(account, device[:udid])

        expect(response).to have_http_status(200)


        log_out_from_identified_customer = {
            data: {
                type: "events",
                attributes: {
                    object: "app",
                    action: "open",
                    device: device,
                    user: {}
                }
            }
        }

        post_json '/v1/events', log_out_from_identified_customer, signed_request_header(account, device[:udid])

        expect(response).to have_http_status(200)

        expect(Customer.count).to eq(2)
        identified_customer = Customer.find_by("account_id" => account.id, "devices._id" => device[:udid])
        anonymous_customer = Customer.find_by("account_id" => account.id, "devices" => {"$size" => 0})

        expect(identified_customer).not_to eq(nil)
        expect(identified_customer.devices.count).to eq(1)
        expect(anonymous_customer).not_to eq(nil)
        expect(anonymous_customer.devices.count).to eq(0)
    end
end
