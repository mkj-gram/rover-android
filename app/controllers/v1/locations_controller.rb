class V1::LocationsController < V1::ApplicationController
    before_action :authenticate,            except: [:create]
    before_action :validate_json_schema,    only: [:create, :update]
    before_action :set_resource,            only: [:show, :update, :destroy]
    before_action :check_access,            only: [:index, :show, :update, :destroy]


    #
    # Shows all users who are tied to a particular account
    # GET /v1/locations
    def index
        # wait for includes
        # @locations = current_account.locations.order(whitelist_order(["created_at"])).paginate(page: current_page, per_page: page_size, total_entries: current_account.locations_count).includes(whitelist_include(["beacons"]))
        # render json: @locations, each_serializer: V1::LocationSerializer, include: whitelist_include(["beacons"]), fields: ["beacons"]
        @locations = current_account.locations.order(whitelist_order(["created_at"])).paginate(page: current_page, per_page: page_size, total_entries: current_account.locations_count)
        render json: @locations, each_serializer: V1::LocationSerializer
    end

    #
    # Shows an individual location
    # GET /v1/locations/:id
    # this is an example of creating a relationship
    # relationships: {
    #   beacons: {
    #       "data": { type: "beacon", id: "12"}
    #   }
    # }
    # this should create a new location and attach the relationship
    def show
        @location = current_resource
        if @location
            render json: @location
        else
            head :not_found
        end
    end

    #
    # Creates a new user under a specified account
    # POST /v1/locations
    #
    def create
        @location = current_account.locations.new(location_params)

        if @location.save
            render json: @location, status: :created, location: @location
        else
            render json: @location.errors, status: :unprocessable_entity
        end
    end

    def update
        @location = current_resource

        if @location.update(location_params)
            head :no_content
        else
            render json: @location.errors, status: :unprocessable_entity
        end
    end

    def destroy
        @location = current_resource
        @location.destroy
        head :no_content
    end

    private

    def location_params
        params.require(:location).permit(:name, :address, :city, :province_state, :postal_zip, :country, :latitude, :longitude, :radius, :google_place_id, :tags => [])
    end

    def locations_per_page
        50
    end

    def set_resource
        set_current_resource(Location.find_by_id(params[:id]))
    end
end
