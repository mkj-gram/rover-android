class PasswordReset < ActiveRecord::Base
    include Tokenable
    include UniqueRecord

    self.primary_key = :user_id
    belongs_to :user

    before_create :attach_user
    before_create :generate_expires_at

    after_create :send_email

    validates :email,
        presence: { message: I18n.t(:"validations.commons.email_missing") },
        email: true,
        allow_blank: false

    validate :user_exists


    def reset_password(password, password_confirmation)
        transaction do
            user.update!({
                             password: password,
                             password_confirmation: password_confirmation,
            })
            self.destroy!
            return true
        end
        return false
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
            errors.add(:email, "email not found")
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
        SendEmailWorker.perform_async("Rover <no-reply@rover.io>", user.email, "Rover Password Reset", "/*insert_passowrd_reset_link*/")
    end
end
