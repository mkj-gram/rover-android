module EddystoneNamespaceAttributes
    extend ActiveSupport::Concern

    included do
        before_validation :clear_unused_attributes
        before_validation :upcase_namespace

        validates :namespace, presence: true
        validates :instance_id, presence: true
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
