#
# Individual user who belongs to an account. These users log into the platform using their email and password
#
#
# @author [chrisrecalis]
#
class User < ActiveRecord::Base

    has_secure_password

    attr_accessor :old_password, :account_title, :account_invite_token

    # has_one :acl, class_name: "UserAcl" -> refer to custom function acl

    belongs_to :account, counter_cache: true
    has_many :sessions do
        def recent
            last
        end
    end

    before_validation :attach_to_account, if: -> { account_id.nil? && !account_invite_token.nil? }


    before_create :create_account, if: -> { account_id.nil? }
    after_create :update_account_user_id
    after_create :create_acl
    after_create :generate_session

    after_create :destroy_account_invite

    before_destroy :can_destroy


    validates :email,
        presence: { message: I18n.t(:"validations.commons.email_missing") },
        email: true,
        uniqueness: true,
        allow_blank: false,
        if: :email_changed?

    validate :has_access_to_account
    validate :can_change_password

    # when changing the password we either have to validate the reset token or
    # we have to validate the existing password

    #
    # A UserAcl required function for determining if this resource belongs to an account
    # @param account_id [Account]
    #
    # @return [Boolean] [if this user belongs to the specified account]
    # def belongs_to_account(account_id)
    #     return self.account_id == account_id
    # end

    # since we want to cache the association we need our own function
    def acl
        @acl ||= Rails.cache.fetch("user/#{self.id}/acl/#{acl_updated_at.to_i}") do
            UserAcl.find_by_user_id(self.id)
        end
    end


    #
    # Returns the most recent created session
    #
    # @return [Session] [description]
    def session
        Rails.logger.info(@tmp_session)
        if @tmp_session
            return @tmp_session
        else
            sessions.recent
        end
    end


    #
    # Generates a formatted email. Email can be in the form of
    # name <email> or email
    #
    # @return [String] [Formatted email]
    def formatted_email
        return user.name.nil? ? user.email : "#{user.name} <#{user.email}>"
    end

    private

    def has_access_to_account
        if self.account_owner == false && changes.has_key?("account_id")
            @invite ||= AccountInvite.find_by_invited_email(self.email)
            if @invite && @invite.account_id == self.account_id
                if @invite.token != self.account_invite_token
                    errors.add(:account, "invite expired ask the account owner to send a new invite")
                end
            else
                errors.add(:account, "you do not have permission to sign up")
            end
        end
    end

    def can_change_password
        if old_password && !self.authenticate(old_password)
            errors.add(:password, "incorrect password")
        end
        # if password_reset_token
        #     reset = PasswordReset.find_by_token(password_reset_token)
        #     if reset && reset.email

        #     else
        #         errors.add(:password, "password reset doesn't exist")
        #         return false
        #     end
        # elsif old_password

        # elsif password_digest.nil?
        #     return true
        # else
        #     errors.add(:password, "authentication failed")
        # end
    end

    def attach_to_account
        @invite = AccountInvite.find_by_invited_email(self.email)
        if @invite
            self.account_id = @invite.account_id
        end
    end

    def create_account
        # create an account with the primary email as the first user to sign up
        account = Account.create(primary_user_id: self.id, title: account_title)
        self.account_owner = true
        self.account_id = account.id
    end

    def create_acl
        if self.account_owner == true
            UserAcl.create!(user_id: self.id, admin: true)
        else
            UserAcl.create!(user_id: self.id)
        end

    end

    def destroy_account_invite
        @invite ||= AccountInvite.find_by_invited_email(self.email)
        if @invite
            @invite.destroy!
        end
    end

    def generate_session
        @tmp_session = Session.build_session(self)
        @tmp_session.save!
    end

    def update_account_user_id
        if self.account_owner == true && changes.has_key?("account_id")
            account.update({primary_user_id: self.id})
        end
    end

    def can_destroy
        if self.account_owner == true
            errors.add(:account, "The account owner cannot delete their profile")
            return false
        end
        return true
    end



end
