require 'rails_helper'

describe "/v1/sessions", :type => :request do
  let(:user) { create(:user) }
  let(:session) { create(:session, user: user) }
  let(:different_account) { create(:different_account) }

  before :each do
    nothing_authenticates
  end

  context "POST" do
    context 'when password is invalid' do
      it 'returns 401 unauthorized' do
        post "/v1/sessions",
          data: {
          type: "sessions",
          attributes: {
            email: user.email,
            password: "invalid"
          }
        }

        expect(response).to have_http_status(401)
      end
    end

    context 'when password is valid' do
      it 'returns 200 OK with a token' do

        if TESTS_STUB_SVC
          expect(AUTHSVC_CLIENT).to receive(:create_user_session).
            with(Rover::Auth::V1::CreateUserSessionRequest.new(
              email: user.email,
              password: user.password,
              last_seen_IP: "",
            )).and_return(Rover::Auth::V1::UserSession.new(
              user_id: user.id,
              key: 'somekey',
              expires_at: Google::Protobuf::Timestamp.new(seconds: Time.now.to_i),
              created_at: Google::Protobuf::Timestamp.new(seconds: Time.now.to_i),
              updated_at: Google::Protobuf::Timestamp.new(seconds: Time.now.to_i),
            ))
        elsif USE_SVC
          # known user in the service
          # ids have to map exactly
          user.id = 3
          user.save!

          user.email = "user3@example.com"
          user.password = "s3cR3t"
        end

        post "/v1/sessions",
          data: {
          type: "sessions",
          attributes: {
            email: user.email,
            password: user.password
          }
        }

        expect(response).to have_http_status(200)

        expect(json).to have_key(:data)
        expect(json[:data]).to have_key(:attributes)
        expect(json[:data][:attributes]).to have_key(:token)
        # expect(json[:data][:attributes][:token]).to eq("23973dfbe6f09e734aecdfc3b33027833e7eb043")
      end

      it 'returns 200 ok with an upcased email' do
        if TESTS_STUB_SVC
          expect(AUTHSVC_CLIENT).to receive(:create_user_session).
            with(Rover::Auth::V1::CreateUserSessionRequest.new(
              email: user.email,
              password: user.password,
              last_seen_IP: "",
            )).and_return(Rover::Auth::V1::UserSession.new(
              user_id: user.id,
              key: 'somekey',
              expires_at: Google::Protobuf::Timestamp.new(seconds: Time.now.to_i),
              created_at: Google::Protobuf::Timestamp.new(seconds: Time.now.to_i),
              updated_at: Google::Protobuf::Timestamp.new(seconds: Time.now.to_i),
            ))
        elsif USE_SVC
          # known user in the service
          # ids have to map exactly
          user.id = 3
          user.save!

          user.email = "user3@example.com"
          user.password = "s3cR3t"
        end

        post "/v1/sessions",
          data: {
          type: "sessions",
          attributes: {
            email: user.email.upcase,
            password: user.password
          }
        }
      end
    end
  end

  context "DELETE" do


    context "when deleting a session which does not belong to you" do
      it 'returns 401 unauthorized' do
        delete "/v1/sessions/#{session.id}", nil, signed_request_header(different_account)

        expect(response).to have_http_status(401)
      end
    end

    context "when deleting a session from the owner account" do
      it 'returns 204 no content' do
        auth_token(session.account.token, account_id: session.account.id)

        delete "/v1/sessions/#{session.id}", nil, signed_request_header(session.account)

        expect(response).to have_http_status(204)
      end
    end

    context "when deleting a session from the user" do
      it 'returns 204 no content' do
        session = auth_session(user)

        delete "/v1/sessions/#{session.id}", nil, {'Authorization' => "Bearer #{session.token}"}

        expect(response).to have_http_status(204)
      end
    end
  end
end
