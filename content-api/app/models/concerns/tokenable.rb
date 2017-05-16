module Tokenable
    extend ActiveSupport::Concern

    included do
        before_create :generate_token
        self.class_attribute :token_size
        self.token_size ||= 16
    end

    protected

    def generate_token
        self.token = loop do
            random_token = SecureRandom.hex(self.token_size)
            break random_token unless self.class.exists?(token: random_token)
        end
    end
end
