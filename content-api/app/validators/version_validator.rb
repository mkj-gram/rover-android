class VersionValidator < ActiveModel::EachValidator
    def validate_each(record, attribute, value)
        if !(value =~ /(\d+\.\d+\.\d+)|(\d+\.\d+)/)
            record.errors[attribute] << (options[:message] || "invalid")
        end
    end
end
