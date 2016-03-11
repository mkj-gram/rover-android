require 'rails_helper'

describe "/v1/events", :type => :request do

    it 'creates a device then updates the user alias' do
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
        post_json '/v1/events', first_event, signed_request_header(account)

        expect(response).to have_http_status(200)


        user = attributes_for(:customer)
        user[:"phone-number"] = user[:phone_number]
        user[:alias] = "nope"
        second_event = {
            data: {
                type: "events",
                attributes: {
                    object: "app",
                    action: "login",
                    device: device,
                    user: user
                }
            }
        }

        post_json '/v1/events', second_event, signed_request_header(account)

        expect(response).to have_http_status(200)

        # expect(Customer.count).to eq(1)
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
        post_json '/v1/events', first_event, signed_request_header(account)

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

        post_json '/v1/events', second_event, signed_request_header(account)

        expect(response).to have_http_status(200)
        # expect(Customer.last.devices.last.sdk_version).to eq("4.0.1")

    end

    it 'creates 2 devices then updates both aliases to the same' do
        # Create the first device
        account = create(:account)
        device1 = attributes_for(:customer_device)

        create_first_device = {
            data: {
                type: "events",
                attributes: {
                    object: "app",
                    action: "open",
                    device: device1,
                    user: {}
                }
            }
        }
        post_json '/v1/events', create_first_device, signed_request_header(account)

        expect(response).to have_http_status(200)

        # Create the second device
        device2 = attributes_for(:customer_device)
        # the device should be different
        device2[:udid] = SecureRandom.uuid
        create_second_device = {
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
        post_json '/v1/events', create_second_device, signed_request_header(account)

        expect(response).to have_http_status(200)
        # login to the first device
        user = attributes_for(:customer)
        user[:"phone-number"] = user[:phone_number]
        user[:alias] = "nope"

        first_device_login = {
            data: {
                type: "events",
                attributes: {
                    object: "app",
                    action: "login",
                    device: device1,
                    user: user
                }
            }
        }

        post_json '/v1/events', first_device_login, signed_request_header(account)

        expect(response).to have_http_status(200)

        # login to the second device with the same user
        second_device_login = {
            data: {
                type: "events",
                attributes: {
                    object: "app",
                    action: "login",
                    device: device2,
                    user: user
                }
            }
        }

        post_json '/v1/events', second_device_login, signed_request_header(account)

        expect(response).to have_http_status(200)

        expect(Customer.count).to eq(2)
        expect(Customer.first.alias).to eq(user[:alias])
        expect(Customer.last.alias).to eq(nil)

    end
end
