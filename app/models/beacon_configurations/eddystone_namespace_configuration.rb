class EddystoneNamespaceConfiguration < BeaconConfiguration

    index_name BeaconConfiguration.index_name
    document_type "eddystone_namespace_configuration"

    after_create :incremement_counter_cache
    after_destroy :decrement_counter_cache

    before_validation :clear_unused_attributes

    validates :namespace, presence: true
    validates :instance_id, presence: true



    def self.protocol
        @protocol ||= "eddystone-namespace"
    end


    private

    def incremement_counter_cache
        super(:eddystone_namespace_configurations_count)
    end

    def decrement_counter_cache
        super(:eddystone_namespace_configurations_count)
    end

    def clear_unused_attributes
        blacklist_attributes = [:uuid, :major, :minor, :url]
        blacklist_attributes.each {|attr| self[attr] = nil }
    end
end
