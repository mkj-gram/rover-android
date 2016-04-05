class EmailValidator < ActiveModel::EachValidator
    def validate_each(record, attribute, value)
        return if allow_blank && (value.nil? || value.empty?)

        if !(value =~ /\A[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\z/i)
            record.errors[attribute] << (options[:message] || I18n.t(:"validations.commons.email_wrong_format"))
        end
    end

    private

    def allow_blank
        options.key?(:allow_blank) && options[:allow_blank] == true
    end
end
