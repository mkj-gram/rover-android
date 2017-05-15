require 'rails_helper'

describe "/v1/users", :type => :request do

  let(:user) { create(:user, password: "paSSw0rd") }
  let(:session) { create(:session, user: user) }

  before :each do
    if TESTS_STUB_SVC
    session.token = JWTToken.build_token(session, jti: 'token')
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
    end
  end

  context "PATCH" do
    context "password change" do
      it 'returns 422 when not providing a current password ' do
        patch "/v1/users/#{user.id}",
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
        patch "/v1/users/#{user.id}",
          {
          data: {

            type: "users",
            id: "#{user.id}",
            attributes: {
              :"current-password" => "THIS_IS_NOT_THE_ORIGINAL_PASSWORD:)",
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
        patch "/v1/users/#{user.id}",
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
        if TESTS_STUB_SVC
        expect(AUTHSVC_CLIENT).to receive(:update_user_password).
          with(Rover::Auth::V1::UpdateUserPasswordRequest.new(
            user_id: user.id,
            account_id: user.account.id,
            password: "newpassword",
          ))
        end

        patch "/v1/users/#{user.id}",
          {
          data: {

            type: "users",
            id: "#{user.id}",
            attributes: {
              :"current-password" => user.password,
              :"password" => "newpassword",
              :"password-confirmation" => "newpassword",
            }
          }
        },
        {
          "Authorization" => "Bearer: #{session.token}"
        }

        expect(response).to have_http_status(200)
      end


  end

    context 'name/email change' do

      it 'returns 200ok when user updates details' do
        if TESTS_STUB_SVC
          expect(AUTHSVC_CLIENT).to receive(:update_user).
            with(Rover::Auth::V1::UpdateUserRequest.new(
              user_id: user.id,
              account_id: user.account.id,
              email: "new-" + user.email,
              name: "new-" + user.name,
          ))
        end

        patch "/v1/users/#{user.id}",
          {
          data: {

            type: "users",
            id: "#{user.id}",
            attributes: {
              email: "new-test@rover.io",
              name: "new-Randall Ward Jr.",
            }
          }
        },
        {
          "Authorization" => "Bearer: #{session.token}"
        }

        expect(response).to have_http_status(200)
        expect(json[:data]).to include({
          id: user.id.to_s,
          attributes: {
            :name=>"new-Randall Ward Jr.",
            :email=>"new-test@rover.io",
            :"current-password"=>"",
            :password=>""
          },
        })
      end

    end

  end
end
