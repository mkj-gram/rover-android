module RequestHelpers
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
end
