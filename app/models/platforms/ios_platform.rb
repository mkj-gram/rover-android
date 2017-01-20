class IosPlatform < ActiveRecord::Base
    include Platformable

    validate :valid_certificate, if: -> { !certificate.nil? }

    before_save :set_app_identifier
    before_save :set_certificate_expiry
    # after_save :update_name_cache

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
            self.certificate_filename = new_certificate.original_filename
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
        if !apns_certificate.valid?
            errors.add(:certificate, "invalid file or passphrase")
        end

        if !apns_certificate.universal?
            errors.add(:certificate, "needs to be a universal certificate")
        end
    end

    def set_app_identifier
        # overwrite the bundle id if a certificate exists
        if apns_certificate
            self.bundle_id = apns_certificate.app_bundle_id
        end
    end

    def set_certificate_expiry
        if credentials_changed?
            if apns_certificate
                self.certificate_expires_at = apns_certificate.expires_at
            else
                self.certificate_expires_at = nil
                self.certificate_filename = nil
            end
        end
    end

    def update_name_cache
        if title_changed?
            account.update_attribute(:ios_platform_name, title)
        end
    end

end
