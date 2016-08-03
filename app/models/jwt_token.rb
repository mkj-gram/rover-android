require 'jwt'

class JWTToken

    def self.build_token(session)
        payload = {
            "iss" => "rover.io",
            "sub" => session.user_id,
            "jti" => session.id
        }
        return JWT.encode(payload, Rails.application.secrets.secret_key_base, 'HS256')
    end

    def self.read(token, property)
        JWTToken.new(token).read(property)
    end

    def initialize(token)
        @token = token
        @errors = []
        @verified = false
        @payload = {}
        verify!
    end

    def errors
        return @errors
    end

    def verified?
        return @verified
    end

    def read(property)
        @payload[property]
    end

    private

    def payload
        return @payload
    end

    def verify!
        begin
            decoded_token = JWT.decode(@token, Rails.application.secrets.secret_key_base, true, { :algorithm => 'HS256'})
            @verified = true
            @payload = decoded_token.first.with_indifferent_access
        rescue JWT::VerificationError => e
            @errors << I18n.t(:"unauthorized.invalid_token")
        rescue JWT::DecodeError => e
            @errors << I18n.t(:"unauthorized.malformed_token")
        end
    end

end
