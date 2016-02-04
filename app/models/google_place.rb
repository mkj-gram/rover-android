class GooglePlace
    @@client = GooglePlaces::Client.new("AIzaSyDMy0oeUHIoagdwLVfRgsV5fprxvpSknzM")

    attr_reader :name, :address, :city, :province, :country, :longitude, :latitude

    def initialize(google_place_id)
        response = @@client.spot(google_place_id)
        components = response.address_components
        # formatted_address_index = Set.new(response.formatted_address.gsub(",", "").split(" "))
        @name = response.name || ""
        @longitude = response.lng
        @latitude = response.lat
        @address = []
        @city = []
        @province = []
        @country = []
        components.each do |component|
            types = component["types"]
            if types.include?("street_number") || types.include?("premise") || types.include?("route")
                @address.push(component["long_name"])
            elsif types.include?("locality")
                @city.push(component["long_name"])
            elsif types.include?("administrative_area_level_1")
                @province.push(component["long_name"])
            elsif types.include?("country")
                @country.push(component["long_name"])
            end
        end

        @address = @address.join(" ")
        @city = @city.join(", ")
        @province = @province.join(", ")
        @country = @country.join(", ")
    end
end
