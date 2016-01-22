module IBeaconAttributes
    extend ActiveSupport::Concern

    included do
        before_validation :clear_unused_attributes
        before_validation :upcase_uuid
    end

    def namespace=(v)
        v
    end

    def instance_id=(v)
        v
    end

    def url=(v)
        v
    end

    protected

    def upcase_uuid
        self.uuid.upcase
    end




    def clear_unused_attributes
        blacklist_attributes = [:namespace, :instance_id, :url]
        blacklist_attributes.each {|attr| self[attr] = nil }
    end
end
