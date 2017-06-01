class Session < ActiveRecord::Base

    belongs_to :account
    belongs_to :user

    unless USE_SVC
      before_create :generate_jwt_token
      before_create :set_expires_at
      before_create :set_last_seen_at
    end

    def self.build_session(user)
        session = Session.new(account_id: user.account_id, user_id: user.id)
        session.user = user
        return session
    end

    def expired?
        Time.zone.now > expires_at
    end

    def verified?
        @verified ||= jwt_token.verified?
    end

    def track_ip_address(ip)
        self.ip_address = ip
    end

    def keep_alive
        # only update keepalive every 10 mins so we aren't slamming postgres
        if ((Time.zone.now - self.last_seen_at) > 10.minutes) || self.expired?
            self.last_seen_at = Time.zone.now
            self.expires_at = Time.zone.now + 24.hours
        end
    end

    def expire!
        # expire in the past in case of clock skew
        self.update_attributes(:expires_at => Time.zone.now - 30.minutes)
    end


    private

    def jwt_token
        @jwt_token ||= JWTToken.new(self.token)
    end

    def generate_jwt_token
        self.token = JWTToken.build_token(self)
    end

    def set_expires_at
        self.expires_at = Time.zone.now + 24.hours
    end

    def set_last_seen_at
        self.last_seen_at = Time.zone.now
    end
end
