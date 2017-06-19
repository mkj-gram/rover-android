require 'rails_helper'

describe "/v1/events", :type => :request do
  let(:account) { create(:account) }
  let(:user) { create(:user, account: account) }
  let(:session) { create(:session, user: user, account: account) }
  let(:customer) { Customer.find_by("account_id" => account.id) }
  # let(:customer_deveice) { |id| Customer.find_by("account_id" => account.id) }

  before :each do
    nothing_authenticates

    auth_token(account.token, account_id: account.id, scopes: ['server'])
  end

  it 'updates the devices sdk version' do
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
    expect(customer.devices.last.sdk_version).to eq("4.0.1")

  end

  it 'creates an identified customer then logs out' do
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

    expect {
      post_json '/v1/events', log_out_from_identified_customer, signed_request_header(account, device[:udid])
    }.to change {
      Customer.count
    }.by(1)

    expect(response).to have_http_status(200)

    identified_customer = Customer.find_by("account_id" => account.id, "devices._id" => device[:udid])
    anonymous_customer = Customer.find_by("account_id" => account.id, "devices" => {"$size" => 0})

    expect(identified_customer).not_to eq(nil)
    expect(identified_customer.devices.count).to eq(1)
    expect(anonymous_customer).not_to eq(nil)
    expect(anonymous_customer.devices.count).to eq(0)
  end
end
