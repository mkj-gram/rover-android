class IosPlatformErrorSerializer < ModelError::Serializer
	attribute :name
	attribute :certificate
	attribute :passphrase
end
