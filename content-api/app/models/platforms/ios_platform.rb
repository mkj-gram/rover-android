class IosPlatform < ActiveRecord::Base
    include Platformable

    validate :valid_certificate, if: -> { !certificate.nil? }

    before_save :set_app_identifier
    before_save :set_certificate_expiry
    # after_save :update_name_cache

    belongs_to :account

    def certificate
        return Base64.decode64(self.apns_certificate)
    end

    def certificate=(new_certificate)
        if new_certificate.is_a?(ActionDispatch::Http::UploadedFile)
            self.certificate_filename = new_certificate.original_filename
            new_certificate = new_certificate.read
        end
        self.apns_certificate = Base64.encode64(new_certificate)
    end

    def passphrase
        return self.apns_passphrase
    end

    def passphrase=(new_passphrase)
        self.apns_passphrase = new_passphrase
    end

    private

    def parse_apns_certificate
        return nil if certificate.nil?
        return ApnsCertificate.new(certificate, passphrase)
    end

    def valid_certificate
        cert = parse_apns_certificate

        if !cert.valid?
            errors.add(:certificate, "invalid file or passphrase")
        end

        if !cert.universal?
            errors.add(:certificate, "needs to be a universal certificate")
        end
    end

    def set_app_identifier
        cert = parse_apns_certificate
        # overwrite the bundle id if a certificate exists
        if cert
            self.bundle_id = cert.app_bundle_id
        end
    end

    def set_certificate_expiry
        if apns_certificate_changed? || apns_passphrase_changed?
            cert = parse_apns_certificate
            if cert
                self.certificate_expires_at = cert.expires_at
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
