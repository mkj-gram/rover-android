class BeaconConfigurationVisit
    include ConfigurationVisit

    document_type "beacon_configuration_visit"

    attribute :beacon_configuration, BeaconConfiguration

    validates :beacon_configuration, presence: true

    def save
        if valid?
            self.__elasticsearch__.index_document(parent: customer.id)
        else
            false
        end
    end

    def configuration_id
        beacon_configuration.id
    end

    def configuration_tags
        beacon_configuration.tags
    end

    def id
        "#{customer.id}-#{beacon_configuration.id}"
    end

end
