require 'rails_helper'

describe "/v1/registrations", :type => :request do

    context "POST" do
        context "Validations" do
            it 'fails due to an invalid email address' do
                post '/v1/registrations',
                data: {
                    type: "registrations",
                    attributes: {
                        name: "Test",
                        email: "invalid",
                        password: "123456"
                    }
                }

                expect(response).to have_http_status(422)
            end

            it 'fails due to no password' do
                post '/v1/registrations',
                data: {
                    type: "registrations",
                    attributes: {
                        name: "Test",
                        email: "test@rover.io",
                    }
                }

                expect(response).to have_http_status(422)
            end

            it 'fails due to too short of a password' do
                post '/v1/registrations',
                data: {
                    type: "registrations",
                    attributes: {
                        name: "Test",
                        email: "test@rover.io",
                        password: "123"
                    }
                }
                expect(response).to have_http_status(422)
            end

            it 'fails due to email already exists' do
                user = create(:user)
                post '/v1/registrations',
                data: {
                    type: "registrations",
                    attributes: {
                        name: "Test",
                        email: user.email,
                        password: "123456"
                    }
                }

                expect(response).to have_http_status(422)
            end


            it 'fails to blank email' do

                post '/v1/registrations',
                data: {
                    type: "registrations",
                    attributes: {
                        name: "Test",
                        password: "123456"
                    }
                }

                expect(response).to have_http_status(422)
            end

            it 'fails due to no name' do
                post '/v1/registrations',
                data: {
                    type: "registrations",
                    attributes: {
                        email: "test@rover.io",
                        password: "123"
                    }
                }

                expect(response).to have_http_status(422)
            end
        end

        context "new registration" do
            it 'creates a new user and account with a session' do
                name = "Test"
                email = "test@rover.io"
                password = "123456"

                post '/v1/registrations',
                data: {
                    type: "registrations",
                    attributes: {
                        name: name,
                        email: email,
                        password: password
                    }
                }

                expect(response).to have_http_status(200)
                expect(json).to have_key(:data)
                expect(json[:data]).to have_key(:attributes)
                attributes = json[:data][:attributes]

                expect(attributes[:email]).to eq(email)
                expect(attributes[:name]).to eq(name)
                expect(attributes[:password]).to eq(nil)
                expect(attributes[:organization]).to eq(name)

            end

            it 'creates a new user and account with the email downcased' do
                name = "Test"
                email = "test@rover.io"
                password = "123456"

                post '/v1/registrations',
                data: {
                    type: "registrations",
                    attributes: {
                        name: name,
                        email: email.upcase, # upcase the email when sending it in
                        password: password
                    }
                }

                expect(response).to have_http_status(200)
                expect(json).to have_key(:data)
                expect(json[:data]).to have_key(:attributes)
                attributes = json[:data][:attributes]

                expect(attributes[:email]).to eq(email)
                expect(attributes[:name]).to eq(name)
                expect(attributes[:password]).to eq(nil)
                expect(attributes[:organization]).to eq(name)
            end
        end

        context "account invite" do
            it 'fails due to invalid account invite token' do
                account = create(:account)

                post '/v1/registrations',
                data: {
                    type: "registrations",
                    attributes: {
                        name: "Test",
                        email: "test@rover.io",
                        password: "123456",
                        token: "123"
                    }
                }

                expect(response).to have_http_status(422)
            end

            it 'fails due to the email not matching the original account invite email' do
                account = create(:account)
                issuer = create(:user)
                invite = AccountInvite.create!(issuer: issuer, account: account, invited_email: "test2@rover.io")

                post '/v1/registrations',
                data: {
                    type: "registrations",
                    attributes: {
                        name: "Test",
                        email: "no-the-same-email@rover.io",
                        password: "123456",
                        token: invite.token
                    }
                }
                expect(response).to have_http_status(422)
            end

            it 'passes with account_id set to the account_invite id' do
                account = create(:account)
                issuer = create(:user)
                invite = AccountInvite.create!(issuer: issuer, account: account, invited_email: "test2@rover.io")

                post '/v1/registrations',
                data: {
                    type: "registrations",
                    attributes: {
                        name: "Test",
                        email: "test2@rover.io",
                        password: "123456",
                        token: invite.token
                    }
                }

                expect(response).to have_http_status(200)
            end
        end
    end

end
