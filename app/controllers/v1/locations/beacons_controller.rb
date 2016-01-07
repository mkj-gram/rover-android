class V1::Locations::BeaconsController < V1::ApplicationController

    def index
        @beacons = current_location.beacons
        @beacons = current_location.beacons.order("id").paginate(page: current_page, per_page: page_size, total_entries: current_location.beacons_count)
        render json: @beacons, each_serializer: V1::BeaconsSerializer
    end

    # this an example of creating a relationship
    #
    def create
    end

    private

    def current_location
        @location ||= Location.find_by_id(params[:location_id])
    end
end
