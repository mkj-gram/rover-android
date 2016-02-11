class BeaconConfigurationActiveTags < ActiveTags
    include TaggableAsync

    def self.lookup_class
        @lookup_class ||= BeaconConfiguration.name
    end

end
