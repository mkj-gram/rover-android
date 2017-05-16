require 'rails_helper'

describe '/v1/proximity-messages', :type => :request do
    let(:account) { FactoryGirl.create(:account) }
    context 'GET' do
        let(:proximity_message) { FactoryGirl.create(:proximity_message)}

        context 'when resource is found' do
            it 'responds with 200' do
                get "/v1/proximity-messages/#{proximity_message.id}", nil, signed_request_header(account)
                expect(response).to have_http_status(200)
            end

            it 'shows the resource' do
                get "/v1/proximity-messages/#{proximity_message.id}", nil, signed_request_header(account)
                expect(json[:data])
                expect(json[:data][:type]).to eq('proximity-messages')
                expect(json[:data][:id]).to eq(proximity_message.id.to_s)
            end

        end

        context 'when resource is not found' do
            it 'responds with 404' do
                get "/v1/proximity-messages/abc", nil, signed_request_header(account)
                expect(response).to have_http_status(404)
            end
        end
    end

end
