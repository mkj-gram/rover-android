class IosPlatform < ActiveRecord::Base
    include Platformable

    validate :valid_certificate

    before_save :set_app_identifier
    before_save :set_certificate_expiry
    after_save :update_name_cache

    belongs_to :account

    def certificate
        if self.credentials
            self.credentials[:certificate]
        else
            nil
        end
    end

    def certificate=(new_certificate)
        if new_certificate.is_a?(ActionDispatch::Http::UploadedFile)
            certificate_filename = new_certificate.original_filename
            new_certificate = new_certificate.read
        end
        self.credentials = ( self.credentials || {}).merge(certificate: new_certificate)
    end

    def passphrase
        if self.credentials
            self.credentials[:passphrase]
        else
            nil
        end
    end

    def passphrase=(new_passphrase)
        self.credentials = ( self.credentials || {}).merge(passphrase: new_passphrase)
    end


    private

    def apns_certificate
        return nil if certificate.nil?
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
        if credentials_changed? && apns_certificate
            self.bundle_id = apns_certificate.app_bundle_id
        end
    end

    def set_certificate_expiry
        if credentials_changed? && apns_certificate
            self.certificate_expires_at = apns_certificate.expires_at
        end
    end

    def update_name_cache
        if title_changed?
            account.update_attribute(:ios_platform_name, title)
        end
    end

end
