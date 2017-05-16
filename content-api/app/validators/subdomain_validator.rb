class SubdomainValidator < ActiveModel::EachValidator

    def validate_each(record, attribute, value)
        return if value.nil? || value.empty?

        reserved_names = %w(www ftp mail pop smtp admin ssl sftp)

        if !(3..63).include?(value.length)
            record.errors[attribute] << (options[:message] || I18n.t(:"validations.commons.subdomain_length"))
        end

        if reserved_names.include?(value)
            record.errors[attribute] << (options[:message] || I18n.t(:"validations.commons.subdomain_reserved_name"))
        end

    
        if !(value =~ /^[^-].*[^-]$/i)
            record.errors[attribute] << (options[:message] || I18n.t(:"validations.commons.subdomain_start_end_hyphen"))
        end

        if !(value =~ /^[a-z0-9\-]*$/i)
            record.errors[attribute] << (options[:message] || I18n.t(:"validations.commons.subdomain_illegal_characters"))
        end

    end

end
