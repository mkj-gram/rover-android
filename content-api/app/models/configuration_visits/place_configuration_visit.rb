class PlaceConfigurationVisit
    include ConfigurationVisit

    document_type "place_configuration_visit"

    attribute :place_configuration, Place

    validates :place_configuration, presence: true

    def save
        if valid?
            self.__elasticsearch__.index_document(parent: customer.id)
        else
            false
        end
    end

    def configuration_id
        place_configuration.id
    end

    def configuration_tags
        place_configuration.tags
    end

    def id
        "#{customer.id}-#{place_configuration.id}"
    end
end
