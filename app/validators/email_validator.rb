class EmailValidator < ActiveModel::EachValidator
    def validate_each(record, attribute, value)
        unless value =~ /\A[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\z/i
            record.errors[attribute] << (options[:message] || I18n.t(:"validations.commons.email_wrong_format"))
        end
    end
end
