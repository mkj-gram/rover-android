module FormattableMessage
    extend ActiveSupport::Concern

    # needs the column to work with
    # example "hello @{customer_name, airmiles user} welcome to the acc"

    MESSAGE_FORMAT_REGEX = /\{[a-zA-Z\_\.\,0-9]*\}/

    included do
        class_attribute :_formattable_message_attribute
    end

    class_methods do
        def message_attribute(column_name)
            self._formattable_message_attribute = column_name
        end
    end

    def formatted_message(opts = {})
        if self._formattable_message_attribute.nil?
            Rails.logger.warn("Attempted to format a message without defining a column")
            return ""
        end
        opts = flatten_hash(opts.with_indifferent_access)
        message = self.send(self._formattable_message_attribute)
        message.gsub(MESSAGE_FORMAT_REGEX) do |string_match|
            # chop off curly braces
            attribute, fallback = string_match[1..string_match.length-2].split(",")
            if opts[attribute]
                opts[attribute]
            else
                fallback
            end
        end
    end

    private

    def flatten_hash(hash)
        hash.each_with_object({}) do |(k, v), h|
            if v.is_a? Hash
                flatten_hash(v).map do |h_k, h_v|
                    h["#{k}.#{h_k}".to_sym] = h_v
                end
            else
                h[k] = v
            end
        end
    end

end
