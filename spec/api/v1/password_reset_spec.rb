require 'rails_helper'

describe "/v1/password-resets", :type => :request do
    context "POST" do
        it 'fails because no user with the email exists' do
            user = create(:user)

            post '/v1/password-resets',
            {
                data: {
                    type: "password-resets",
                    attributes: {
                        email: "doesntexist@nope.com"
                    }
                }
            }


            expect(response).to have_http_status(422)
        end

        it 'returns 200 when the user with the email exists' do
            user = create(:user)

            post '/v1/password-resets',
            {
                data: {
                    type: "password-resets",
                    attributes: {
                        email: user.email
                    }
                }
            }

            expect(response).to have_http_status(201)
        end
    end

    context "INDEX" do
        it 'returns 404 when no password reset exists with the specified token' do

            get '/v1/password-resets?token=123'

            expect(response).to have_http_status(404)
        end

        it 'returns 200 when a password with a token exists' do
            password_reset = create(:password_reset)

            get '/v1/password-resets?' + {token: password_reset.token}.to_query

            expect(response).to have_http_status(200)
        end
    end

    context "PATCH" do
        it 'return 422 because password length is too short' do

            password_reset = create(:password_reset)

            patch "/v1/password-resets/#{password_reset.id}",
            {
                data: {
                    type: "password-resets",
                    id: password_reset.id.to_s,
                    attributes: {
                        token: password_reset.token,
                        password: "123"
                    }
                }
            }

            expect(response).to have_http_status(422)
        end

        it 'returns 400 because the token specified is invalid' do
            password_reset = create(:password_reset)

            patch "/v1/password-resets/#{password_reset.id}",
            {
                data: {
                    type: "password-resets",
                    id: password_reset.id.to_s,
                    attributes: {
                        token: "notTheToken",
                        password: "123456"
                    }
                }
            }

            expect(response).to have_http_status(400)
        end

        it 'returns 200 and updates the users password' do
            new_password = "notthesamepassword"

            password_reset = create(:password_reset)
            user = password_reset.user

            patch "/v1/password-resets/#{password_reset.id}",
            {
                data: {
                    type: "password-resets",
                    id: password_reset.id.to_s,
                    attributes: {
                        token: password_reset.token,
                        password: new_password
                    }
                }
            }

            expect(response).to have_http_status(204)

            # now attempt to log in with the new password

            post '/v1/sessions', {
                data: {
                    type: 'sessions',
                    attributes: {
                        email: user.email,
                        password: new_password
                    }
                }
            }

            expect(response).to have_http_status(200)
        end
    end
end
