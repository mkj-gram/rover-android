class UrlConfiguration < BeaconConfiguration
    index_name BeaconConfiguration.index_name
    document_type "url_configuration"

    after_create :incremement_counter_cache
    after_destroy :decrement_counter_cache

    before_validation :clear_unused_attributes
    validates :url, presence: true

    def self.protocol
        @protocol ||= "url"
    end


    private

    def incremement_counter_cache
        super(:ibeacon_configurations_count)
    end

    def decrement_counter_cache
        super(:ibeacon_configurations_count)
    end

    def clear_unused_attributes
        blacklist_attributes = [:namespace, :instance_id, :uuid, :major, :minor]
        blacklist_attributes.each {|attr| self[attr] = nil }
    end
end
