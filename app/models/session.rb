class Session < ActiveRecord::Base

    belongs_to :account
    belongs_to :user

    before_create :generate_jwt_token

    def self.build_session(user)
        session = Session.new(account_id: user.account_id, user_id: user.id)
        session.user = user
        return session
    end

    def expired?
        @expired ||= DateTime.now > expires_at
    end

    def verified?
        @verified ||= jwt_token.verified?
    end


    def duration
        24.hours
    end

    def expires_at
        @expires_at ||= Time.at(jwt_token.read(:exp).to_i).to_datetime
    end


    private

    def jwt_token
        @jwt_token ||= JWTToken.new(self.token)
    end

    def generate_jwt_token
        self.token = JWTToken.build_token(self)
    end
end
