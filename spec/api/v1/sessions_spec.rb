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
        end
    end
end
