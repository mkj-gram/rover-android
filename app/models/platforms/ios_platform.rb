class IosPlatform < Platform

    validate :valid_certificate

    before_create :set_app_identifier

    def set_credentials(certificate, passphrase)
        self.credentials.merge!({certificate: certificate, passphrase: passphrase})
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

    def credentials_json
        {
            "certificate" => self.certificate,
            "passphrase" => self.passphrase,
        }
    end


    private



    def apns_certificate
        @apns_certificate ||= ApnsCertificate.new(certificate, passphrase)
    end

    def valid_certificate
        if !apns_certificate.universal?
            errors.add(:certificate, "needs to be a universal certificate")
        end
    end

    def set_app_identifier
        self.package_id = apns_certificate.app_bundle_id
    end

end
