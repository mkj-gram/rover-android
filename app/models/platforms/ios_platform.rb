class IosPlatform < ActiveRecord::Base
    include Platformable

    validate :valid_certificate

    before_create :set_app_identifier

    before_save :update_name_cache

    belongs_to :account

    def set_credentials(certificate, passphrase)
        self.credentials = {certificate: certificate, passphrase: passphrase}
    end

    def certificate
        if self.credentials
            self.credentials[:certificate]
        else
            nil
        end
    end

    def passphrase
        if self.credentials
            self.credentials[:passphrase]
        else
            nil
        end
    end

    private

    def apns_certificate
        @apns_certificate ||= ApnsCertificate.new(certificate, passphrase)
    end

    def valid_certificate
        if !apns_certificate.valid_certificate?
            errors.add(:certificate, "invalid")
        end
        if !apns_certificate.valid_passphrase?
            errors.add(:passphrase, "incorrect")
        end
        if !apns_certificate.universal?
            errors.add(:certificate, "needs to be a universal certificate")
        end
    end

    def set_app_identifier
        self.bundle_id = apns_certificate.app_bundle_id
    end

    def update_name_cache
        if self.changes.include?(:title)
            account.update_attributes(ios_platform_name: self.title)
        end
    end

end
