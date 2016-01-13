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
        PasswordReset.transaction do
            user.password = password
            user.password_confirmation = password
            user.save!
            self.destroy!
            return true
        end
        return false
    rescue ActiveRecord::RecordInvalid => e
        return false
    end

    def expired?
        DateTime.now > self.expires_at
    end

    def self.get_template
        @template ||= %{
            <p>Dear <%= @user.name %>,</p>

            <p>You recently requested a password reset for your Rover account. To complete the process, click the link below.</p>

            <a href="...">Reset now ></a>

            <p>If you didn't make this request, it's likely that another user has entered your email address by mistake and your account is still secure. If you believe an unauthorized person has accessed your account, you should change your password as soon as possible from your Rover account page at <a href="https://rover-front-end-builds-staging.herokuapp.com">https://rover-front-end-builds-staging.herokuapp.com</a>.

            <p>Rover Support</p>
        }
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
        message = render_password_reset
        SendEmailWorker.perform_async("Rover <support@rover.io>", user.formatted_email, "How to reset your Rover password", message)
    end

    def render_password_reset
        @user = user
        @url = Rails.configuration.password_reset["host"] + "/reset-password" + "?" + {token: self.token}.to_query
        ERB.new(PasswordReset.get_template, 3, '>').result(binding)
    end

end
