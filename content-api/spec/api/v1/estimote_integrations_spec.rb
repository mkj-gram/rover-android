require 'rails_helper'

describe "/v1/estimote-integrations", :type => :request do

  let(:account) { create(:account) }
  let(:user) { create(:user, account: account) }
  let(:session) { create(:session, user: user, account: account) }
  let(:estimote) { create(:estimote_integration) }

  before :each do
    nothing_authenticates

    auth_token(session.account.token, account_id: session.account.id)
  end

    context "GET" do
        context "when beacon exists" do
            it 'returns 200 OK' do
                get "/v1/estimote-integrations/#{estimote.id}", nil, signed_request_header(account)

                expect(response).to have_http_status(200)

                expect(json).to have_key(:data)
                expect(json[:data]).to have_key(:id)
                expect(json[:data][:id]).to eq(estimote.id.to_s)
            end
        end

        context "when beacon doesn't exist" do
            it 'returns 404 not found' do

                get "/v1/estimote-integrations/#{estimote.id + 1}", nil, signed_request_header(account)

                expect(response).to have_http_status(404)
            end
        end
    end

    context "CREATE" do
        context "when input is valid" do
            it 'returns 201 Created' do

                post "/v1/estimote-integrations",
                {
                    data: {
                        type: :"estimote-integrations",
                        attributes: {
                            :"app-id" => "123",
                            :"app-token" => 123,
                            enabled: true
                        }
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(201)

                id = json.fetch(:data).fetch(:id)
                get "/v1/estimote-integrations/#{id}", nil, signed_request_header(account)

                expect(response).to have_http_status(200)
            end

            it 'returns 201 Created and passes syncing' do
                post "/v1/estimote-integrations",
                {
                    data: {
                        type: :"estimote-integrations",
                        attributes: {
                            :"app-id" => "rover-content-api-7jp",
                            :"app-token" => "3b5fd956d27d2f760c142d7ef0ffaed2",
                            enabled: true
                        }
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(201)

                id = json[:data][:id]
                get "/v1/estimote-integrations/#{id}", nil, signed_request_header(account)

                # since workers are performed inline we know the sync has already occured
                expect(response).to have_http_status(200)
                expect(json[:data][:attributes][:syncing]).to eq(false)
                expect(json[:data][:relationships]).to have_key(:"latest-sync")

                latest_sync_id = json.dig(:data, :relationships, :"latest-sync", :data, :id)

                get "/v1/estimote-sync-jobs/#{latest_sync_id}", nil, signed_request_header(account)

                expect(response).to have_http_status(200)
                expect(json[:data][:attributes][:status]).to eq("queued")
            end
        end

        context "when input is invalid" do
            it 'return 422' do
                post "/v1/estimote-integrations",
                {
                    data: {
                        type: :"estimote-integrations",
                        attributes: {
                            :"app-id" => "123",
                            enabled: true
                        }
                    }
                }, signed_request_header(account)

                expect(response).to have_http_status(422)
                expect(json).to have_key(:errors)
                expect(json[:errors].size).to eq(1)
            end
        end
    end
end
