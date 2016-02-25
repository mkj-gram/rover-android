class LocationConfigurationVisit
    include ConfigurationVisit

    document_type "location_configuration_visit"

    attribute :location_configuration, Location

    validates :location_configuration, presence: true

    def save
        if valid?
            self.__elasticsearch__.index_document(parent: customer.id)
        else
            false
        end
    end

    def configuration_id
        location_configuration.id
    end

    def configuration_tags
        location_configuration.tags
    end

    def id
        "#{customer.id}-#{location_configuration.id}"
    end
end
