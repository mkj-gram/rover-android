
#
# Creates an invite for new users to join an account
# this class is responsible for sending out an invitation email to the recipient
#
# @author [chrisrecalis]
#
class AccountInvite < ActiveRecord::Base
    include Tokenable
    include UniqueRecord

    belongs_to :account, counter_cache: true
    belongs_to :issuer, foreign_key: "issuer_id", class_name: "User"

    after_create :send_email


    protected

    def existing_record
        @existing_record ||= AccountInvite.find_by_invited_email(self.invited_email)
    end
    private

    def send_email
        # This needs to change I'm really bad with messaging
        SendEmailWorker.perform_async(
            "Rover <no-reply@rover.io>",
            self.invited_email,
            "Invitition from #{issuer.name} on Rover",
            "#{issuer.name || issuer.email} has invited you to collaborate on #{account.title}"
        )
    end
end
