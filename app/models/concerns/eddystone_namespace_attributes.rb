module EddystoneNamespaceAttributes
    extend ActiveSupport::Concern

    included do
        before_validation :clear_unused_attributes

        validates :namespace, presence: true
        validates :instance_id, presence: true
    end

    def uuid=(v)

    end
    def major=(v)

    end
    def minor=(v)

    end
    def url=(v)

    end

    def namespace=(val)
        self[:namespace] = val.upcase
    end

    def instance_id=(val)
        self[:instance_id] = val.upcase
    end

    def namespace_changed?
        changes.include?(:namespace)
    end

    def instance_id_changed?
        changes.include?(:instance_id)
    end

    def configuration_attributes
        {
            namespace: self.namespace,
            :"instance-id" => self.instance_id
        }
    end

    private

    def clear_unused_attributes
        blacklist_attributes = [:uuid, :major, :minor, :url]
        blacklist_attributes.each {|attr| self[attr] = nil }
    end

    def upcase_namespace
        self.namespace.upcase if !self.namespace.nil?
    end
end
