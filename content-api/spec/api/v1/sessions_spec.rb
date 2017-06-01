require 'rails_helper'

describe "/v1/sessions", :type => :request do
    context "POST" do
        context 'when password is invalid' do
            it 'returns 401 unauthorized' do
                user = create(:user)

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
                user = create(:user)

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
                user = create(:user)
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

                session = create(:session)

                different_account = create(:different_account)

                delete "/v1/sessions/#{session.id}", nil, signed_request_header(different_account)

                expect(response).to have_http_status(401)

            end
        end

        context "when deleting a session from the owner account" do
            it 'returns 204 no content' do
                session = create(:session)

                if TESTS_STUB_SVC
                  auth, api = AUTHSVC_CLIENT, Rover::Auth::V1

                  expect(AUTHSVC_CLIENT).to receive(:authenticate_token)
                  .with(api::AuthenticateRequest.new(
                    key: session.user.account.token,
                    last_seen_IP: "127.0.0.1",
                  ))
                  .and_return(api::AuthContext.new(
                    account_id: session.user.account.id,
                  ))
                end

                delete "/v1/sessions/#{session.id}", nil, signed_request_header(session.account)

                expect(response).to have_http_status(204)
            end
        end

        context "when deleting a session from the user" do
            it 'returns 204 no content' do
                session = create(:session)

               if TESTS_STUB_SVC
                 # with authservices tokens aren't generated but received from one
                 # so just pretend we've got a token
                 session.token = JWTToken.build_token(session, jti: "token")
                 session.save!
                 expect(AUTHSVC_CLIENT).to receive(:authenticate_user_session).
                   with(Rover::Auth::V1::AuthenticateRequest.new(
                     key: "token",
                     last_seen_IP: "127.0.0.1",
                   )).and_return(Rover::Auth::V1::AuthContext.new(
                     user_id: session.user_id,
                     account_id: session.user.account_id,
                     permission_scopes: [''],
                   ))
               elsif USE_SVC
                 # skip for now :/
                 skip
               end

                delete "/v1/sessions/#{session.id}", nil, {'Authorization' => "Bearer #{session.token}"}

                expect(response).to have_http_status(204)
            end
        end
    end
end
