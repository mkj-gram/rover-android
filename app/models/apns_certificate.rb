class ApnsCertificate

    attr_reader :certificate, :key

    def initialize(certificate, passphrase = nil)
        @errors = []
        begin
            @key = OpenSSL::PKey::RSA.new(certificate, passphrase)
            @certificate = OpenSSL::X509::Certificate.new(data)
        rescue Exception => e
            @valid = false
            @errors.add(e.message)
        end
    end

    def valid?
        !!@valid
    end

    def errors
        @errors
    end

    def test_connection!
        if production? || universal?
            uri = URI(APPLE_PRODUCTION_GATEWAY_URI)
        else
            uri = URI(APPLE_DEVELOPMENT_GATEWAY_URI)
        end
        # socket = TCPSocket.new(uri.host, uri.port)
        # ssl = OpenSSL::SSL::SSLSocket.new(socket, ssl_context)
        # ssl.sync = true
        # ssl.connect
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


    DEVELOPMENT_ENV_EXTENSION       = "1.2.840.113635.100.6.3.1".freeze
    PRODUCTION_ENV_EXTENSION        = "1.2.840.113635.100.6.3.2".freeze
    UNIVERSAL_CERTIFICATE_EXTENSION = "1.2.840.113635.100.6.3.6".freeze

    def extension(oid)
        @certificate.extensions.find { |ext| ext.oid == oid }
    end
end
