module RequestHelpers
    module JsonHelper
        def json
            (reparse_and_never_memoize_as_response_may_change = -> do
                 JSON.parse(response.body, symbolize_names: true)
            end).call
        end

        def json_request_headers
            { 'Content-Type' => 'application/json', 'Accept' => 'application/json' }
        end
    end

    module HeaderHelper
        def sign_request!(account_or_session)
            if account_or_session.is_a?(Account)
                request.headers["X-Rover-REST-API-Key"] = account_or_session.token
            else
                request.headers["Authorization"] = "Bearer: #{account_or_session.token}"
            end

        end
    end
end

RSpec.configure do |config|
    config.include RequestHelpers::JsonHelper, type: :request
    config.include RequestHelpers::HeaderHelper, type: :request
end
