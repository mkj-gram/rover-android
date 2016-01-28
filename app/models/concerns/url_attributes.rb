module UrlAttributes
    extend ActiveSupport::Concern

    included do
        before_validation :clear_unused_attributes
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

    def namespace=(v)
        v
    end

    def instance_id=(v)
        v
    end

    protected

    def clear_unused_attributes
        blacklist_attributes = [:uuid, :major, :minor, :namespace, :instance_id]
        blacklist_attributes.each {|attr| self[attr] = nil }
    end
end
