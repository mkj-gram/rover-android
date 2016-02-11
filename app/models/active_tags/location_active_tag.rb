class LocationActiveTag < ActiveTag
    include TaggableAsync

    def self.lookup_class
        @lookup_class ||= Location.name
    end
end
