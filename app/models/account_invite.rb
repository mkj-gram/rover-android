
#
# Creates an invite for new users to join an account
# this class is responsible for sending out an invitation email to the recipient
#
# @author [chrisrecalis]
#
class AccountInvite < ActiveRecord::Base
    include Tokenable
    include UniqueRecord

    belongs_to :account
    belongs_to :user, foreign_key: "issuer_id"

    after_create :send_email


    protected

    def existing_record
        @existing_record ||= AccountInvite.find_by_invited_email(self.invited_email)
    end
    private

    def send_email
        # This needs to change I'm really bad with messaging
        SendEmailWorker.perform_async(
            "no-reply@rover.io",
            self.invited_email,
            "Invitition from #{user.name} on Rover",
            "#{user.name || user.email} has invited you to collaborate on #{account.title}"
        )
    end
end
