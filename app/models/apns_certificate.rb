class ApnsCertificate

    attr_reader :certificate, :key

    def initialize(p12_certificate, passphrase = nil)
        @errors = []
        begin
            p12 = OpenSSL::PKCS12.new(p12_certificate, passphrase)
            @key = p12.key
            @certificate = p12.certificate
        rescue Exception => e
            Rails.logger.warn(e)
        end
    end

    def valid?
        @key && @certificate
    end

    def expires_at
        @certificate ? @certificate.not_after : nil
    end

    def ssl_context
        @ssl_context ||= OpenSSL::SSL::SSLContext.new.tap do |context|
            context.key = @key
            context.cert = @certificate
        end
    end

    def production?
        !extension(PRODUCTION_ENV_EXTENSION).nil?
    end

    def development?
        !extension(DEVELOPMENT_ENV_EXTENSION).nil?
    end

    def universal?
        !extension(UNIVERSAL_CERTIFICATE_EXTENSION).nil?
    end

    def app_bundle_id
        @certificate.subject.to_a.find { |key, *_| key == "UID" }[1]
    end

    private

    INVALID_CERT = "Neither PUB key nor PRIV key: not enough data".freeze
    INVALID_PASSPHRASE = "Neither PUB key nor PRIV key: nested asn1 error".freeze
    DEVELOPMENT_ENV_EXTENSION       = "1.2.840.113635.100.6.3.1".freeze
    PRODUCTION_ENV_EXTENSION        = "1.2.840.113635.100.6.3.2".freeze
    UNIVERSAL_CERTIFICATE_EXTENSION = "1.2.840.113635.100.6.3.6".freeze

    def extension(oid)
        return nil if @certificate.nil?
        @certificate.extensions.find { |ext| ext.oid == oid }
    end
end
