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
        def sign_request!(account)
            request.headers["X-Rover-REST-API-Key"] = account.token
        end
    end
end

RSpec.configure do |config|
    config.include RequestHelpers::JsonHelper, type: :request
    config.include RequestHelpers::HeaderHelper, type: :request
end
