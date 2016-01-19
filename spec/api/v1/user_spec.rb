require 'rails_helper'

describe "/v1/users", :type => :request do
    context "PATCH" do
        context "password change" do
            it 'returns 422 when not providing a current password ' do
                session = create(:session)
                user = session.user
                patch '/v1/users/1',
                {
                    data: {

                        type: "users",
                        id: "#{user.id}",
                        attributes: {
                            password: "123456"
                        }
                    }
                },
                {
                    "Authorization" => "Bearer: #{session.token}"
                }

                expect(response).to have_http_status(422)
            end

            it 'returns 422 when the current password is provided but incorrect' do
                session = create(:session)
                user = session.user
                patch '/v1/users/1',
                {
                    data: {

                        type: "users",
                        id: "#{user.id}",
                        attributes: {
                            :"current-password" => "123456",
                            password: "123456"
                        }
                    }
                },
                {
                    "Authorization" => "Bearer: #{session.token}"
                }

                expect(response).to have_http_status(422)
            end

            it 'returns 422 when the current password is provided but the password is too short' do
                session = create(:session)
                user = session.user
                patch '/v1/users/1',
                {
                    data: {

                        type: "users",
                        id: "#{user.id}",
                        attributes: {
                            :"current-password" => "password",
                            password: "123"
                        }
                    }
                },
                {
                    "Authorization" => "Bearer: #{session.token}"
                }

                expect(response).to have_http_status(422)
            end

            it 'returns 200ok when the current password is provided and new password is valid' do
                session = create(:session)
                user = session.user
                patch '/v1/users/1',
                {
                    data: {

                        type: "users",
                        id: "#{user.id}",
                        attributes: {
                            :"current-password" => "password",
                            password: "newpassword"
                        }
                    }
                },
                {
                    "Authorization" => "Bearer: #{session.token}"
                }

                expect(response).to have_http_status(422)
            end
        end
    end
end
