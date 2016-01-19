require 'rails_helper'

describe "/v1/account", :type => :request do
    context "GET" do
        it 'displays current account' do
            account = create(:account)


            get "/v1/accounts/#{account.id}", nil, {'X-Rover-REST-API-Key' => account.token}

            expect(response).to have_http_status(200)
            expect(json).to have_key(:data)
            expect(json[:data]).to have_key(:attributes)
            expect(json[:data][:attributes]).to have_key(:token)
            expect(json[:data][:attributes][:token]).to eq(account.token)
            # because ember uses - as its seperator the json we parse looks like :"" in ruby hashes
            expect(json[:data][:attributes][:"share-key"]).to eq(account.share_key)
            expect(json[:data][:attributes][:title]).to eq(account.title)
        end
    end
end
