module Events
    module LocationEvents
        class LocationEvent < Event

            before_save :update_customer_location

            def self.event_id
                Event::LOCATION_EVENT_ID
            end

            attr_reader :longitude, :latitude, :radius, :region_limit

            def initialize(event_attributes)
                super
                @longitude = event_attributes[:longitude]
                @latitude = event_attributes[:latitude]
                @radius = event_attributes[:radius]
                @region_limit = device.ios? ? 20 : 100
            end

            def update_customer_location
                if customer
                    customer.location = GeoPoint.new(latitude: latitude, longitude: longitude)
                    customer.save
                end
            end

            # def attributes
            #     super.merge(
            #         {
            #             longitude: longitude,
            #             latitude: latitude
            #         }
            #     )
            # end


            private

            def place
                @place ||= Place.where(latitude: latitude, longitude: longitude).first
            end

        end

    end
end
