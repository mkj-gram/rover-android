module FormattableMessage
    extend ActiveSupport::Concern

    # needs the column to work with
    # example "hello @{customer_name, airmiles user} welcome to the acc"

    MESSAGE_FORMAT_REGEX = /\{[a-zA-Z\_0-9\.\,\s\-]*\}/

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



end
