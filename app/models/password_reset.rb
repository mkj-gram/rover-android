class PasswordReset < ActiveRecord::Base
    include Tokenable
    include UniqueRecord

    belongs_to :user

    before_create :attach_user
    before_create :generate_expires_at

    after_create :send_email

    validates :email,
        presence: true,
        email: { allow_blank: true },
        allow_blank: false,
        if: -> { new_record? || email_changed? }

    validate :user_exists

    self.token_size = 32

    def reset_password(password)
        Rails.logger.info("updating password to: #{password}")
        user.password = password
        user.password_confirmation = password
        return user.save

    end

    def expired?
        DateTime.now > self.expires_at
    end

    protected

    def has_record_collision
        !existing_record.nil?
    end

    def existing_record
        @existing_record ||= PasswordReset.find_by_email(self.email)
    end



    private

    def user_exists
        if !User.exists?(email: self.email)
            errors.add(:email, "not found")
        end
    end

    def attach_user
        user = User.find_by_email(self.email)
        if user
            self.user_id = user.id
        end
    end

    def generate_expires_at
        self.expires_at = DateTime.now + 2.hours
    end

    def send_email
        url =  Rails.configuration.password_reset["host"] + "/reset-password" + "?" + {token: self.token}.to_query
        SendEmailWorker.perform_async("Rover <no-reply@rover.io>", user.formatted_email, "Rover Password Reset", "Please vist this #{url}")
    end
end
