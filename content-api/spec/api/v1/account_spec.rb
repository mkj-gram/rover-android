require 'rails_helper'

describe "/v1/account", :type => :request do
  let(:account) { create(:account) }

  before :each do
    unless TESTS_STUB_SVC
      return
    end

    auth, api = AUTHSVC_CLIENT, Rover::Auth::V1

    tokens = [
      api::Token.new(
        key: 'webtoken',
        permission_scopes: ['web'],
      ),
      api::Token.new(
        key: 'servertoken',
        permission_scopes: ['server'],
      ),
      api::Token.new(
        key: 'sdktoken',
        permission_scopes: ['sdk'],
      ),
      api::Token.new(
        key: 'othertoken',
        permission_scopes: [],
      ),
    ]

    expect(AUTHSVC_CLIENT).to receive(:authenticate_token)
    .with(api::AuthenticateRequest.new(
      key: account.token,
      last_seen_IP: "127.0.0.1",
    ))
    .and_return(api::AuthContext.new(
      account_id: account.id,
    ))

    expect(AUTHSVC_CLIENT).to receive(:list_tokens)
    .with(api::ListTokensRequest.new(
      account_id: account.id,
    ))
    .and_return(api::ListTokensResponse.new(
      tokens: tokens,
    ))
  end

  context "GET" do
    it 'displays current account' do

      get "/v1/accounts/#{account.id}", nil, signed_request_header(account)

      expect(response).to have_http_status(200)
      expect(json).to have_key(:data)
      expect(json[:data]).to have_key(:attributes)
      expect(json[:data][:attributes]).to have_key(:token)
      expect(json[:data][:attributes][:token]).to eq(account.token)
      # because ember uses - as its seperator the json we parse looks like :"" in ruby hashes
      expect(json[:data][:attributes][:"share-key"]).to eq(account.share_key)
      expect(json[:data][:attributes][:title]).to eq(account.title)

      if USE_SVC
        expect(json[:data][:attributes]).to include({
          :"web-token" => "webtoken",
          :"sdk-token" => "sdktoken",
          :"server-token" => "servertoken",
        })
      end
    end
  end
end
