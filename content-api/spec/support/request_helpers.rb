module RequestHelpers
  module AuthHelper

    # do not auth anyone by default
    def nothing_authenticates
      unless TESTS_STUB_SVC
        return
      end

      # by default everything is unauthenticated
      [:authenticate_token, :authenticate_user_session, :create_user_session].each do |mthd|
        allow(AUTHSVC_CLIENT).to receive(mthd).and_raise(GRPC::Unauthenticated)
      end
    end

    def auth_session(user, scopes: [''] )
      session = create(:session, user: user, token: JWTToken.build_token(double(user_id: user.id), jti: "token"))

      unless TESTS_STUB_SVC
        return session
      end

      expect(AUTHSVC_CLIENT).to receive(:authenticate_user_session).
        with(Rover::Auth::V1::AuthenticateRequest.new(
          key: 'token',
          last_seen_IP: "127.0.0.1",
        ))
        .and_return(Rover::Auth::V1::AuthContext.new(
          user_id: session.user_id,
          account_id: session.user.account_id,
          permission_scopes: scopes,
        ))

      session
    end

    def auth_token(token, account_id: 0, scopes: [''] )
      unless TESTS_STUB_SVC
        return session
      end
      expect(AUTHSVC_CLIENT).to receive(:authenticate_token).
        with(Rover::Auth::V1::AuthenticateRequest.new(
          key: token,
          last_seen_IP: "127.0.0.1",
        ))
        .at_least(:once)
        .and_return(Rover::Auth::V1::AuthContext.new(
          user_id: 0,
          account_id: account_id,
          permission_scopes: scopes,
        ))
    end

  end

    module JsonHelper
        def json
            (reparse_and_never_memoize_as_response_may_change = -> do
                 JSON.parse(response.body, symbolize_names: true)
            end).call
        end

        def post_json(url, json, headers)
            headers.merge!({ 'Content-Type' => 'application/json', 'Accept' => 'application/json' })
            post(url, json.to_json, headers)
        end

        def json_request_headers
            { 'Content-Type' => 'application/json', 'Accept' => 'application/json' }
        end
    end

    module HeaderHelper
        def signed_request_header(account, device_id = nil)
            headers = {'X-Rover-Api-Key' => account.token}
            headers.merge!('X-Rover-Device-Id' => device_id) if device_id
            return headers
        end

        # def sign_request!(account_or_session)
        #     if account_or_session.is_a?(Account)
        #         request.headers[""] = account_or_session.token
        #     else
        #         request.headers["Authorization"] = "Bearer: #{account_or_session.token}"
        #     end

        # end
    end
end

RSpec.configure do |config|
    config.include RequestHelpers::JsonHelper, type: :request
    config.include RequestHelpers::HeaderHelper, type: :request
    config.include RequestHelpers::AuthHelper, type: :request
end
