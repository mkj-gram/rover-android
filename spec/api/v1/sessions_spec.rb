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
            it 'returns 200OK with a jwt token' do
                user = create(:user)
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

                delete "/v1/sessions/1", nil, {'X-Rover-REST-API-Key' => different_account.token}

                expect(response).to have_http_status(401)

            end
        end

        context "when deleting a session from the owner account" do
            it 'returns 204 no content' do
                session = create(:session)

                delete "/v1/sessions/1", nil, {'X-Rover-REST-API-Key' => session.account.token}

                expect(response).to have_http_status(204)
            end
        end

        context "when deleting a session from the user" do
            it 'returns 204 no content' do
                session = create(:session)

                delete "/v1/sessions/1", nil, {'Authorization' => "Bearer #{session.token}"}

                expect(response).to have_http_status(204)
            end
        end
    end
end
