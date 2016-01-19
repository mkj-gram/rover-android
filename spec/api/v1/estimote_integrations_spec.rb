require 'rails_helper'

describe "/v1/estimote-integrations", :type => :request do
    context "GET" do
        context "when beacon exists" do
            it 'returns 200 OK' do

                estimote = create(:estimote_integration)
                account = estimote.account

                get "/v1/estimote-integrations/#{estimote.id}", nil, {'X-Rover-REST-API-Key' => account.token}

                expect(response).to have_http_status(200)

                expect(json).to have_key(:data)
                expect(json[:data]).to have_key(:id)
                expect(json[:data][:id]).to eq(estimote.id.to_s)
            end
        end

        context "when beacon doesn't exist" do
            it 'returns 404 not found' do

                estimote = create(:estimote_integration)
                account = estimote.account

                get "/v1/estimote-integrations/#{estimote.id + 1}", nil, {'X-Rover-REST-API-Key' => account.token}

                expect(response).to have_http_status(404)
            end
        end
    end

    context "CREATE" do
        context "when input is valid" do
            it 'returns 201 Created' do

                account = create(:account)
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
                },
                {
                    'X-Rover-REST-API-Key' => account.token
                }

                expect(response).to have_http_status(201)

                id = json[:data][:id]
                get "/v1/estimote-integrations/#{id}", nil, {'X-Rover-REST-API-Key' => account.token}

                expect(response).to have_http_status(200)
            end
        end

        context "when input is invalid" do
            it 'return 422' do
                account = create(:account)

                post "/v1/estimote-integrations",
                {
                    data: {
                        type: :"estimote-integrations",
                        attributes: {
                            :"app-id" => "123",
                            enabled: true
                        }
                    }
                },
                {
                    'X-Rover-REST-API-Key' => account.token
                }

                expect(response).to have_http_status(422)
                expect(json).to have_key(:errors)
                expect(json[:errors].size).to be(2)
            end
        end
    end
end
