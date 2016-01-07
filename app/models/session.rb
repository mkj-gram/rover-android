class Session < ActiveRecord::Base

    belongs_to :account
    belongs_to :user

    before_create :generate_jwt_token

    def self.build_session(user)
        Session.new(account_id: user.account_id, user_id: user.id)
    end

    def expired?
        @expired ||= DateTime.now.to_i > expires_at
    end

    def duration
        24.hours
    end

    def expires_at
        @expires_at ||= JWTToken.read(self.token, :exp)
    end


    private

    def generate_jwt_token
        self.token = JWTToken.build_token(self)
    end
end
