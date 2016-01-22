module EddystoneNamespaceAttributes
    extend ActiveSupport::Concern

    included do
        before_validation :clear_unused_attributes
        before_validation :upcase_namespace

    end

    def uuid=(v)
        v
    end

    def major=(v)
        v
    end

    def minor=(v)
        v
    end

    def url=(v)
        v
    end

    protected

    def clear_unused_attributes
        blacklist_attributes = [:uuid, :major, :minor, :url]
        blacklist_attributes.each {|attr| self[attr] = nil }
    end

    def upcase_namespace
        self.namespace.upcase
    end

end
