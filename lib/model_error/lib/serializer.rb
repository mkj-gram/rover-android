require 'lib/serializer/attributes'
module ModelError
    class Serializer
        include Attributes

        # class RegistrationError < ModelError::Serializer
        # attribute :account_invite_token, key: :token
        # end
        def self.serialize(errors)
            serialized_errors = []
            _attributes_data.each do |key, attribute|
                messages = attribute.serialize(key, errors)
                serialized_errors += messages if !messages.empty?
            end
            return serialized_errors
        end
    end
end
