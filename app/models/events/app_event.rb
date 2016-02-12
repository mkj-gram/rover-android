class AppEvent < Event


    # type is location
    # action update
    # going to get longitude latitude radius
    #
    #
    # want to return geogences they should be monitoring for

    attr_reader :longitude, :latitude, :radius

    def initialize(event_attributes)
        super
    end


    def save
        # silent save if error?
    end

    def json_response
        {
            data: {object: object, action: action}
        }
    end


end
