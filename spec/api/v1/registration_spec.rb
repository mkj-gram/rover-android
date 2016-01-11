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
                        password: ""
                    }
                }

                # this is a 400 because ruby removes keys with empty values
                expect(response).to have_http_status(400)
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

            it 'fails due to no name' do
                post '/v1/registrations',
                data: {
                    type: "registrations",
                    attributes: {
                        email: "test@rover.io",
                        password: "123"
                    }
                }

                # missing param
                expect(response).to have_http_status(400)
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
                expect(attributes[:password]).to eq("")
                expect(attributes[:organization]).to eq(name)

            end
        end
    end

end
